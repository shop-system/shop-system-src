package com.shop.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;

/**
 * Created by dxgong on 2018/7/22.
 *
 * 登录
 */
@Controller
@RequestMapping("/loginController")
public class LoginController {

    /**
     * 跳转到首页
     * @return String 视图
     * */
    @RequestMapping("/toIndex")
    public String toIndex () {
        return "/common/index";
    }

}
