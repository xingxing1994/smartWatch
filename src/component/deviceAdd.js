/**
 * Created by user on 2016/9/9.
 */


import React from 'react';
import Cookie from './cookie';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import ToastSuccess from './ToastSuccess';
import ToastError from './ToastError';

var DeviceAdd = React.createClass({
    getInitialState: function () {
        return {
            content: '',
            toast: null
        }
    },

    handleClick: function () {
        var IMEI = this.refs.IMEI.value.trim(),
            nick = this.refs.nick.value.trim(),
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            that = this,
            flag = /[0-9]/;
        //到时这里需要输入判断格式问题

        if (!(IMEI || nick || flag.test(IMEI))) {

            that.setState({content: "你输入的IMEI号错误"});
        } else {

            that.setState({content: ""});
        }
        CreateXHR({
            type: "POST",
            url: "http://api.smartlocate.cn/v1/device",
            data: {
                username: username,
                ticket: ticket,
                IMEI: IMEI,
                nick: nick
            },
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({toast: "绑定成功"});
                        that.refs.toastSuccess.show();
                        window.setTimeout(function () {
                            that.refs.toastSuccess.hide();
                        }, 2000);
                        break;
                    case 30001:
                        that.setState({toast: "该设备不存在"});
                        that.refs.toastError.show();
                        window.setTimeout(function () {
                            that.refs.toastError.hide();
                        }, 2000);
                        break;
                    case 30003:
                        that.setState({toast: "你已绑定该设备了"});
                        that.refs.toastError.show();
                        window.setTimeout(function () {
                            that.refs.toastError.hide();
                        }, 2000);
                        break;
                    case 44001:
                        hashHistory.push('/login');
                        break;
                    default:
                        break;
                }
            },
            error: function (xhr) {
                console.log(xhr.status + xhr.statusText);
            }
        });
    },
    render: function () {
        return (
            <div className="page deviceAddPage">
                <div className="content" style={{padding: "10px"}}>
                    <div className="weui_cells">
                        <div className="weui_cell" style={{borderRadius:"5px",border:"1px solid #04be02",padding:"20px"}}>
                            <div className="weui_cell_hd">
                                <label className="weui_label">设备号：</label>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input className="weui_input" type="number" pattern="[0-9]*" placeholder="输入IMEI号" ref="IMEI"/>
                            </div>
                        </div>
                        <div className="weui_cell" style={{borderRadius:"5px",border:"1px solid #04be02",padding:"20px",marginTop:"10px"}}>
                            <div className="weui_cell_hd">
                                <label className="weui_label">设备昵称:</label>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input className="weui_input" type="text" placeholder="请输入宝贝昵称" ref="nick"/>
                            </div>
                        </div>
                        <div className="weui_btn_area">
                            <a className="weui_btn weui_btn_primary" href="javascript:void(0);" onClick={this.handleClick}>
                                确定
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <ul>
                        <li style={{backgroundColor: "#34AAB7"}}>
                            <a href="test.html#/setting">
                                <i className="iconfont">&#xe6f4;</i>设备
                            </a>
                        </li>
                        <li style={{backgroundColor: "#54CC76"}}>
                            <a href="#">
                                <i className="iconfont">&#x3478;</i>主页
                            </a>
                        </li>
                    </ul>
                </div>
                <p style={{color:"red"}}>{this.state.content}</p>
                <ToastError  ref="toastError" toast={this.state.toast}/>
                <ToastSuccess  ref="toastSuccess" toast={this.state.toast}/>
            </div>
        )
    }
});


export default DeviceAdd;