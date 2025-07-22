package com.mattermost.rnbeta.push

import cn.jpush.android.service.JPushMessageReceiver

/**
 * 自定义JPush message 接收器, 继承JPushMessageReceiver
 * 
 * 如果不需要在接收到通知时立即进行自定义操作，保持这个类为空即可。
 * 如果需要处理接收到的自定义消息（非通知），可以重写 onReceive 方法。
 */
class JPushReceiver : JPushMessageReceiver() {
    // 目前可以为空，后续可在此处重写方法以自定义处理消息
}
