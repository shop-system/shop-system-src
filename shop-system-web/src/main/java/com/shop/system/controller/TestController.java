package com.shop.system.controller;

import com.shop.user.service.TestDubbo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

@Controller
public class TestController {

    @Autowired
    private TestDubbo testDubbo;


    @RequestMapping("/test")
    public String test(){
        String str = testDubbo.testDubbo("dubbo 擦");
        System.out.println("ceshi");
        System.out.println(str);
        return "/index_test";
    }

    @RequestMapping("/test2")
    public String test2(HttpServletRequest request) {
        ServletContext sc = request.getSession().getServletContext();
        ApplicationContext ac1 = WebApplicationContextUtils.getRequiredWebApplicationContext(sc);
        TestDubbo testDubbos = (TestDubbo)ac1.getBean("testDubbo");
        String bookName = testDubbos.testDubbo("hello dubbo");
        System.out.println(bookName);
        System.out.println("ca");
        return "index";
    }


}