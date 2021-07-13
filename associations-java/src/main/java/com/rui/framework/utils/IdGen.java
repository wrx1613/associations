package com.rui.framework.utils;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.sound.midi.Soundbank;
import java.security.SecureRandom;
import java.util.UUID;

/**
 * 封装各种生成唯一性ID算法的工具类.
 *
 * @author 黄炳桂 516821420@qq.com
 * @version 2013-01-15
 */
@Service
@Lazy(false)
public class IdGen {

    private static SecureRandom random = new SecureRandom();

    /**
     * 封装JDK自带的UUID, 通过Random数字生成, 中间无-分割.
     */
    public static String uuid() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    /**
     * 使用SecureRandom随机生成Long.
     */
    public static long randomLong() {
        return Math.abs(random.nextLong());
    }

    public static void main(String[] args) {
        for (int i = 0; i < 172; i++) {
            System.out.println(uuid());
        }
    }

}