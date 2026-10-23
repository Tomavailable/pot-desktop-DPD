use tauri::{command, AppHandle};
use rusqlite::{Connection, OptionalExtension};
use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
pub struct DpdResult {
    pub found: bool,
    pub query_word: String,
    pub matched_lemma: Option<String>,
    pub pos: Option<String>,
    pub grammar: Option<String>,
    pub meaning: Option<String>,
    pub root: Option<String>,
    pub match_type: Option<String>,
}

// 1. 获取本地配置文件路径 (存放在 Pot 的官方应用配置目录下)
fn get_dpd_config_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    let mut path = app_handle.path_resolver().app_config_dir()
        .ok_or_else(|| "无法获取 Pot 应用配置目录".to_string())?;
    fs::create_dir_all(&path).map_err(|e| format!("创建配置目录失败: {}", e))?;
    path.push("dpd_config.txt"); // 简单存储路径字符串
    Ok(path)
}

// 2. Tauri 命令：保存用户设置的 dpd.db 路径
#[command]
pub async fn save_dpd_path(app_handle: AppHandle, path: String) -> Result<(), String> {
    let config_path = get_dpd_config_path(&app_handle)?;
    fs::write(&config_path, path.trim()).map_err(|e| format!("写入路径配置失败: {}", e))?;
    Ok(())
}

// 3. Tauri 命令：获取当前已保存的 dpd.db 路径
#[command]
pub async fn get_dpd_path(app_handle: AppHandle) -> Result<String, String> {
    let config_path = get_dpd_config_path(&app_handle)?;
    if config_path.exists() {
        let saved_path = fs::read_to_string(config_path).map_err(|e| format!("读取路径配置失败: {}", e))?;
        let trimmed = saved_path.trim().to_string();
        if !trimmed.is_empty() {
            return Ok(trimmed);
        }
    }
    // 默认兜底路径
    Ok("D:/dpd/dpd.db".to_string())
}

// 4. 核心查词命令（自动从配置中读取路径）
#[command]
pub async fn query_dpd_db(app_handle: AppHandle, word: String) -> Result<DpdResult, String> {
    // 自动获取路径
    let db_path = get_dpd_path(app_handle).await?;
    
    let conn = Connection::open(&db_path).map_err(|e| format!("打开数据库失败 [路径: {}]: {}", db_path, e))?;
    let query_word = word.trim().to_lowercase();

    if query_word.is_empty() {
        return Ok(empty_result(query_word));
    }

    // 级联查词逻辑：原形 -> 变形 -> 模糊/复合词
    if let Some(res) = query_headword_by_lemma(&conn, &query_word)? {
        return Ok(res);
    }
    if let Some(lemma) = query_lemma_by_inflection(&conn, &query_word)? {
        if let Some(res) = query_headword_by_lemma(&conn, &lemma)? {
            let mut res_w = res;
            res_w.match_type = Some(format!("inflection (from: {})", query_word));
            return Ok(res_w);
        }
    }
    if let Some(res) = query_headword_by_fuzzy_or_sandhi(&conn, &query_word)? {
        return Ok(res);
    }

    Ok(empty_result(query_word))
}

// --- 辅助方法 ---
fn empty_result(word: String) -> DpdResult {
    DpdResult { found: false, query_word: word, matched_lemma: None, pos: None, grammar: None, meaning: None, root: None, match_type: None }
}

fn query_headword_by_lemma(conn: &Connection, lemma: &str) -> Result<Option<DpdResult>, String> {
    let mut stmt = conn.prepare("SELECT lemma_1, pos, grammar, meaning_1, root FROM dpd_headwords WHERE lemma_1 = ?1 OR lemma_2 = ?1 LIMIT 1").map_err(|e| e.to_string())?;
    stmt.query_row([lemma], |row| {
        Ok(DpdResult {
            found: true, query_word: lemma.to_string(),
            matched_lemma: row.get(0).ok(), pos: row.get(1).ok(), grammar: row.get(2).ok(), meaning: row.get(3).ok(), root: row.get(4).ok(),
            match_type: Some("exact_lemma".to_string()),
        })
    }).optional().map_err(|e| e.to_string())
}

fn query_lemma_by_inflection(conn: &Connection, word: &str) -> Result<Option<String>, String> {
    let mut stmt = conn.prepare("SELECT lemma_1 FROM dpd_headwords WHERE inflections LIKE ?1 LIMIT 1").map_err(|e| e.to_string())?;
    let pattern = format!("%{}%", word);
    stmt.query_row([pattern], |row| row.get(0)).optional().map_err(|e| e.to_string())
}

fn query_headword_by_fuzzy_or_sandhi(conn: &Connection, word: &str) -> Result<Option<DpdResult>, String> {
    let mut stmt = conn.prepare("SELECT lemma_1, pos, grammar, meaning_1, root FROM dpd_headwords WHERE lemma_1 LIKE ?1 LIMIT 1").map_err(|e| e.to_string())?;
    let pattern = format!("%{}%", word);
    stmt.query_row([pattern], |row| {
        Ok(DpdResult {
            found: true, query_word: word.to_string(),
            matched_lemma: row.get(0).ok(), pos: row.get(1).ok(), grammar: row.get(2).ok(), meaning: row.get(3).ok(), root: row.get(4).ok(),
            match_type: Some("compound_fuzzy".to_string()),
        })
    }).optional().map_err(|e| e.to_string())
}
