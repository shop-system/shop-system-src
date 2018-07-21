package com.shop.user.service.impl;

import com.shop.user.service.TestDubbo;
import org.springframework.stereotype.Service;

/**
 * Created by dxgong on 2018/7/20.
 */
@Service
public class TestDubboImpl implements TestDubbo {
    @Override
    public String testDubbo(String str) {
        return "Success:" + str;
    }
}
