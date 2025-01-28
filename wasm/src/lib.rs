mod utils;

use utils::set_panic_hook;
use wasm_bindgen::prelude::*;
use js_sys::{Array, JSON, JsString, Object};
use gloo_utils::format::JsValueSerdeExt;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    set_panic_hook();

    Ok(())
}

/**
 * 使用方式: `JSON.stringify(value, replacer)`
 * 
 * 很慢, JavaScript侧调用replacer时需要序列化和反序列化, 而replacer注定被调用很多次.
 */
#[wasm_bindgen]
pub fn replacer(_: JsString, val: JsValue) -> JsValue {
    if val.is_object() && !Array::is_array(&val) {
        let entries = Object::entries(&val.into());
        entries.sort();
        Object::from_entries(&entries).unwrap().into()
    } else {
        val
    }
}

/**
 * 使用方式: `stringify(value)`
 * 
 * 很慢, 本质上与`JSON.stringify(value, replacer)`相同, 只不过`JSON.stringify`的调用者从JavaScript侧换成了WASM侧.
 */
#[wasm_bindgen]
pub fn stringify(value: &JsValue) -> Result<JsString, JsValue> {
    let replacer: Closure<dyn Fn(JsString, JsValue) -> JsValue> = Closure::new(
        |_: JsString, val: JsValue| -> JsValue {
            if val.is_object() && !Array::is_array(&val) {
                let entries = Object::entries(&val.into());
                entries.sort();
                Object::from_entries(&entries).unwrap().into()
            } else {
                val
            }
        }
    );

    let result = JSON::stringify_with_replacer(
        value,
        &replacer.into_js_value()
    );

    result
}

/**
 * 使用方式: `serdeStringify(value)`
 * 
 * 很慢, 但由于减少了与JavaScript侧的交流次数, 导致比其他方式略有性能提升.
 * 
 * 注意:
 * - 此函数没有实现目标功能, 只是为了测试性能而存在.
 * - 该函数的性能表现依赖于默认分配器, 在使用wee_alloc时性能非常差.
 */
#[wasm_bindgen(js_name = serdeStringify)]
pub fn serde_stringify(value: &JsValue) -> Result<String, JsValue> {
    let json_value = serde_wasm_bindgen::from_value::<serde_json::Value>(
        value.clone()
    )?;

    let result = serde_json::to_string(&json_value)
        .map_err(|err| err.to_string())?;

    Ok(result)
}

/**
 * 使用方式: `glooStringify(value)`
 * 
 * 很慢, 但由于减少了与JavaScript侧的交流次数, 导致比其他方式略有性能提升.
 * 
 * 注意:
 * - 此函数没有实现目标功能, 只是为了测试性能而存在.
 * - 该函数的性能表现依赖于默认分配器, 在使用wee_alloc时性能非常差.
 */
#[wasm_bindgen(js_name = glooStringify)]
pub fn gloo_stringify(value: &JsValue) -> Result<String, JsValue> {
    let json_value = value.into_serde::<serde_json::Value>()
        .map_err(|err| err.to_string())?;

    let result = serde_json::to_string(&json_value)
        .map_err(|err| err.to_string())?;

    Ok(result)
}
