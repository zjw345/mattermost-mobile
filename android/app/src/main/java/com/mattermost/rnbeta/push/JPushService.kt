package com.mattermost.rnbeta.push

import cn.jpush.android.service.JCommonService

/**
 * 自定义 JPush Service，继承自 JCommonService
 *
 * 这个类的内部可以保持为空。它的主要作用就是在 AndroidManifest.xml 中被注册，
 * 以满足 JCore SDK 的运行要求，从而确保推送服务的稳定长连接。
 */
class JPushService : JCommonService() {
    // 保持为空即可
}
