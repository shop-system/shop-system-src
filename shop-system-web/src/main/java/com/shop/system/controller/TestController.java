package com.shop.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("test")
public class TestController {

    @RequestMapping("test")
    public String test(){

        System.out.println("dd");
        System.out.println("可以跑了");
        return "sb";
    }
}