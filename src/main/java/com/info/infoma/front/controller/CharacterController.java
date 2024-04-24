package com.info.infoma.front.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/char")
public class CharacterController {

    @GetMapping("/{character_name}")
    public String baseInfo(Model model, @PathVariable("character_name") String characterName) {
        model.addAttribute("character_name", characterName);
        return "/character/base";
    }
}
