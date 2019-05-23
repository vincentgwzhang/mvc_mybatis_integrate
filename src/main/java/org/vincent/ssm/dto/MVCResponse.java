package org.vincent.ssm.dto;

import java.util.HashMap;
import java.util.Map;

public class MVCResponse {

    private int code;

    private String message;

    private Map<String, Object> extend = new HashMap<>();

    public static MVCResponse success() {
        MVCResponse result = new MVCResponse();
        result.setCode(100);
        result.setMessage("Success");
        return result;
    }

    public static MVCResponse fail() {
        MVCResponse result = new MVCResponse();
        result.setCode(200);
        result.setMessage("Fail");
        return result;
    }

    public MVCResponse add(String key, Object value) {
        this.getExtend().put(key, value);
        return this;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getExtend() {
        return extend;
    }

    public void setExtend(Map<String, Object> extend) {
        this.extend = extend;
    }
}
