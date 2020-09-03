import Icon, { MoneyCollectTwoTone, UpOutlined } from '@ant-design/icons';
import {
    message,
    Drawer,
    Checkbox,
    Alert,
    Button,
    Typography,
    Select,
    Collapse,
    Steps,
    Divider,
} from 'antd';
import React, { Component } from 'react';
import { Redirect, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
// import Address_form from './address_form'
// import Parcel_form from './parcel_form'
// import Carrier_form from './carrier_form'
// import Finish_form from './finish_form'
import Information from './information_step'
import Payment from './payment_step'
import Finish from './finish_step'
import LocalAtmOutlinedIcon from '@material-ui/icons/LocalAtmOutlined';
import {
    get,
    post
} from '../../../util/fetch';
import { actions as single_order_form } from '../../../reducers/shipping_platform/single_order_form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const { Panel } = Collapse;
const { Text } = Typography;
const { Step } = Steps;

const Sender = () => (
    <svg t="1578568585168" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2803" width="24" height="24"><path d="M 699 213.55 L 513.55 90.07 a 9.39 9.39 0 0 0 -10.39 0 L 317.73 213.55 a 9.35 9.35 0 0 0 5.2 17.13 h 68.35 V 459 a 28.28 28.28 0 0 0 28.1 28.44 h 178 A 28.28 28.28 0 0 0 625.43 459 V 230.68 h 68.35 a 9.35 9.35 0 0 0 5.22 -17.13 Z m -148.5 17.13 V 413.6 h -84.29 V 204.08 a 9.36 9.36 0 0 1 3.89 -7.59 l 33.71 -24.25 a 7.53 7.53 0 0 1 8.74 0 l 34 24.27 a 9.36 9.36 0 0 1 3.92 7.61 Z" fill="#1296db" p-id="2804"></path><path d="M 893.09 593.4 L 834.5 310.23 a 37.15 37.15 0 0 0 -7.27 -17.11 c -0.14 -0.19 -0.28 -0.37 -0.43 -0.55 l -0.59 -0.73 c -0.28 -0.34 -0.58 -0.68 -0.88 -1 l -0.19 -0.23 a 37.07 37.07 0 0 0 -27.53 -12.21 h -105 a 37.46 37.46 0 0 0 -37.46 37.46 a 37.46 37.46 0 0 0 37.46 37.46 h 74.85 l 44.87 216.88 H 692.52 a 38.81 38.81 0 0 0 -30.87 15.65 l -56.75 80.49 H 419.32 l -56.81 -80.5 a 39.11 39.11 0 0 0 -31 -15.62 H 212.39 l 44.16 -217 h 73.9 a 37.47 37.47 0 0 0 37.47 -37.46 a 37.47 37.47 0 0 0 -37.47 -37.46 H 229.66 a 37.66 37.66 0 0 0 -40.75 29.53 l -58.22 286.1 a 37.09 37.09 0 0 0 -1.69 22.26 l 70.1 290.21 a 37.82 37.82 0 0 0 42.63 28.6 l 542 0.22 a 37.82 37.82 0 0 0 41.21 -28.83 L 895 616.21 a 37 37 0 0 0 -1.91 -22.81 Z m -135.2 267.11 l -491.82 -0.2 l -52 -215.14 h 98.8303 l 53.94 76.43 a 37.43 37.43 0 0 0 33 19.69 h 224.7 A 37.45 37.45 0 0 0 658 720.71 l 53.27 -75.54 h 98.6297 Z" fill="#108ee9" p-id="2805"></path></svg>
);

const Recepiant = () => (
    <svg t="1578569888016" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="936" width="24" height="24"><path d="M879.098 877.875H146.807c-81.365 0-81.366-81.365-81.366-81.365V511.73l203.414-366.146H757.05L960.464 511.73v284.78c0 81.366-81.366 81.365-81.366 81.365zM716.367 226.95H309.538l-142.39 284.78h183.073s81.366 0 81.366 81.366v40.683h162.731v-40.683s0-81.366 81.366-81.366h183.073l-142.39-284.78z m162.731 366.145H685.493c-5.696 10.679-9.809 23.543-9.809 40.683 0 81.366-81.366 81.366-81.366 81.366H431.587s-81.366 0-81.366-81.366c0-17.14-4.113-30.004-9.809-40.683H146.807V796.51h732.291V593.095zM329.88 389.681h366.146l20.341 40.683H309.538l20.342-40.683z m40.683-81.366h284.78l20.341 40.683H350.221l20.342-40.683z" p-id="937" fill="#8a8a8a"></path></svg>
)

const MyFirstIcon = props => <Icon component={Sender} {...props} />;

const RecepiantIcon = props => <Icon component={Recepiant} {...props} />;

const layout = ['发件人', '收件人', '包裹信息']

const current_step = ['information', 'payment', 'finished']

class Create_order_page extends React.Component {

    onChange = current => {
        console.log('onChange:', current);
        this.setState({ current });
    };

    state = {
        step_status : undefined,
        current: 0,
        childrenDrawer: false,
        is_loading: false,
        is_expand: false,
        visible: false,
        bill_total: 0,
        drawer_padding_Left: 256,
        status: [
            'process',
            'wait',
            'wait',
        ],
        disabled: [
            false,
            true,
            true,
            true
        ],
        current_form: undefined
    };

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: false,
        });
    };

    showChildrenDrawer = () => {
        this.setState({
            childrenDrawer: true,
        });
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    postBill = (rate) => {
        let obj ={
            'billing_information' : {}
        }
        obj.billing_information.on_display = true 
        obj.billing_information.total = rate 
        this.props.set_form_info(obj)

        // this.setState({
        //     bill_total: rate,
        //     visible: true,
        // });
    }

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    changeHeight = () => {
        this.setState({
            is_expand: !this.state.is_expand,
        });
    }

    set_current_form = (form) => {
        this.setState({ current_form: form });
    }

    handle_redirect = current => {
        const current_url = step_array[current] == 'single_order' ? '' : step_array[current]
        this.props.history.push(`/user/create/single_order/${current_url}`)
    }

    onChange = current => {
        let current_step = step_object[this.getKeyOfSubMenus().LastChildOfUrl]
        if (current_step < current) {
            this.state.current_form.validateFields((err, values) => { if (!err) this.handle_redirect(current) });
        } else this.handle_redirect(current)
    }

    // reset = () => {
    //     let re_status = [
    //         'process',
    //         'wait',
    //         'wait',
    //         'wait',
    //     ]
    //     let re_disabled = [
    //         false,
    //         true,
    //         true,
    //         true
    //     ]
    //     this.setState({ status: re_status, disabled: re_disabled })
    // }

    set_all_disabled = () => {
        let all_disabled = [
            true,
            true,
            true,
            true
        ]
        let list_status = this.state.status.map((item, index) => {
            if (index == 3) {
                item = 'process'
            }
            if (index == 2) {
                item = 'finish'
            }
            return item
        })
        this.setState({ status: list_status, disabled: all_disabled })
    }

    set_finished = (current_step, next_step) => {
        let current_index = step_object[current_step]
        let next_index = step_object[next_step]
        let list_status = this.state.status.map((item, index) => {
            if (index == current_index) {
                item = 'finish'
            }
            if (index == next_index && item != 'finish') {
                item = 'process'
            }
            return item
        })

        let list_disabled = this.state.disabled.map((item, index) => {
            if (index == next_index) {
                item = false
            }
            return item
        })
        this.setState({ status: list_status, disabled: list_disabled })
    }

    getKeyOfSubMenus = () => {
        var str = this.props.history.location.pathname.substring('/user/'.length) || '/' //  /seller/order/new   --->  order/new 
        var result = {
            parent: undefined,
            childern: []
        }
        let initial = 0
        for (var i = 0; i < str.length; i++) {
            if (str[i] == '/') {
                !result.parent ? result.parent = str.substring(initial, i) : result.childern.push(str.substring(initial, i))
                initial = i + 1;
            }
            if (str.lastIndexOf('/') == i && str.substring(initial, str.length)) {
                result.childern.push(str.substring(initial, str.length))
            }
        }
        return {
            Parent: result.parent,  //order/new   --> order
            Children: result.childern, //order/new   --> new 
            //   LastChildOfUrl: '/' + result.childern[0]
            // 设置为0 表示如果有大于1个子类，都不继续向下映射 暂时只允许一个子类出现在面包屑中，防止对应边栏key和面包屑等不能对应问题。
            LastChildOfUrl: result.childern[result.childern.length - 1]
        }
    }

    display_content = (current) => {
        switch (current) {
            case 'information':
                return (
                    <Information
                        postBill={(rate) => this.postBill(rate)}
                    />)
                break;
            case 'payment':
                return (<Payment />)
                break;
            case 'finished':
                return (
                    <Finish
                        reset={() => this.reset()}
                    />)
                break;
        }
    }

    next = () => {
        const current = this.state.current + 1;
        this.setState({ current , step_status :'process'});
        window.scrollTo(0, 0)
    }

    pervious = () => {
        const current = this.state.current - 1;
        this.setState({ current , step_status :'process'});
        window.scrollTo(0, 0)
    }

    pay = () => {
        this.setState({ is_loading: true });
        message
            .loading('正在支付', 2.5)
            .then(() => message.info('支付完成', 1))
            .then(() => {
                message.loading({ content: '正在生成运单', key: 'pay', duration: 0 })

                // message.loading({ content: '正在生成运单', key: 'pay', duration: 0 });
                //测试
                post('/user/mock_submit_order', { "order_id": "I201912291212Tj04npAIFcj" })
                    .then(res => {
                        if (res.code == 0) {
                            message.success({ content: '获取运单成功！', key: 'pay', duration: 5})
                            const current = this.state.current + 1;
                            this.setState({ current , is_loading: false , step_status :'finish'});
                        } else {
                            message.error({ content: "创建订单失败, " + `${res.message}`, key: 'pay', duration: 10 })
                            this.setState({ is_loading: false ,step_status :'error'})
                        }    
                    })
                    // .catch(error => { notification.error(format.notfication_remote_server_error(handle_error(error).message)) })
                    .catch(error => {
                        message.error({ content: `创建订单失败,${error}`, key: 'pay', duration: 10 });
                        console.log(error)
                        this.setState({ is_loading: false ,step_status :'error'})
                    })
                // .finally(this.setState({ is_loading: false }))
            });


        // message.loading({ content: '正在生成运单', key: 'pay', duration: 0 });
        // post('/user/mock_submit_order', { "order_id": "I201912291212Tj04npAIFcj" })
        //     .then(res => {
        //         if (res.code == 0) {
        //             message.success({ content: '成功获取运单！', key: 'pay', duration: 2 })
        //             const current = this.state.current + 1;
        //             this.setState({ current });
        //         } else {
        //             message.error({ content: "创建订单失败, " + `${res.message}`, key: 'pay', duration: 5 })
        //         }
        //         this.setState({ is_loading: false })
        //     })
        //     .catch(error => {
        //         message.error({ content: `创建订单失败,${error}`, key: 'pay', duration: 5 });
        //         console.log(error)
        //         this.setState({ is_loading: false })
        //     })
   

    }

    reset = () =>   this.setState({ current: 0 ,step_status :'process' })
    
    
    display_term = () => {
        return (
            <div>
                <Text style={{ fontSize: '16px', fontWeight: 700, }} >服务条款</Text>
                <Divider style={{ marginTop: 6, marginBottom: 6 }}></Divider>
                <Checkbox style={{ marginBottom: '64px', display: 'block' }}>请确认以地址信息，都真实有效。如不符实，本平台对任何造成服务的影响没有法律责任</Checkbox>
            </div>
        )
    }

    display_action = (current) => {

        let Button_props = [
            {
                aciton_one: this.next,
                label_one: '下一步',
                aciton_two: undefined,
                label_two: '重置所有',
            },
            {
                aciton_one: this.pay,
                label_one: '付款',
                aciton_two: this.pervious,
                label_two: '上一步',
            },
            {
                aciton_one: undefined,
                label_one: '打印',
                aciton_two: undefined,
                label_two: '重新创建',
            },
        ]

        return (
            <div>
                <Button
                    loading={this.state.is_loading}
                    onClick={() => Button_props[current].aciton_one()}
                    type="primary"
                    style={{ width: 120, marginBottom: '10px' }}
                >
                    {Button_props[current]['label_one']}
                </Button>

                <Button
                    disabled={this.state.is_loading}
                    onClick={() => Button_props[current].aciton_two()}
                    style={{ width: 120, marginBottom: '10px', marginLeft: '10px' }}
                >
                    {Button_props[current]['label_two']}
                </Button>
            </div>
        )
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(this.props.collapsed != nextProps.collapsed) return false
    //     return true
    // }

    componentDidMount() {
        window.scrollTo(0, 0)
    }


    render() {
        const { current } = this.state;       
        return (
            <div>
                <Steps current={current} status = {this.state.step_status} style={{ background: '#fff', padding: 32, paddingLeft: "8%", paddingRight: "8%", width: '100%' }} >
                    <Step key="选择服务" title="填表" description="填写信息,选择服务" disabled={this.state.disabled[0]} />
                    <Step key="选择支付方式" title="支付" description="选择付款方式并支付" disabled={this.state.disabled[2]} />
                    <Step key="订单完成并打印运单" title="完成" description="打印运单或稍后处理" disabled={this.state.disabled[3]} />
                </Steps>
                <div style={{ background: '#fff', padding: 32, paddingRight: "16%", paddingLeft: "13%", }}>
                    {this.display_content(current_step[current])}
                </div>

                <div style={{ background: '#fff', padding: 32, paddingTop: 12, paddingRight: "16%", paddingLeft: "13%", width: '100%', }}>
                    {current == 2 ? null : this.display_term()}
                </div>

                <div style={{ background: '#fff', padding: 32, paddingTop: 0, paddingRight: "16%", paddingLeft: "13%", width: '100%' }}>
                    {current == 2 ? null : this.display_action(current)}
                </div>

                <Drawer
                    title={
                        <div>
                            <MoneyCollectTwoTone style={{ display: 'inline-block', fontSize: '18px' }} />
                            <div style={{ display: 'inline-block', width: 200, marginLeft: 8, fontSize: 18 }}> <a>总费用 ： $ {this.props.billing_information.total} </a></div>
                            <UpOutlined
                                style={{ display: 'inline-block', marginLeft: '35%', fontSize: 18, }}
                                rotate={this.state.is_expand ? 180 : 0}
                                onClick={this.changeHeight} />
                        </div>}
                    // headerStyle ={{paddingLeft : "35%"}}
                    // bodyStyle ={{overflow:'visible'}}
                    drawerStyle={{ overflow: 'hidden' }}
                    style={{ paddingLeft: this.props.collapsed ? 80 : 256 }}
                    placement="bottom"
                    zIndex={200}
                    mask={false}
                    closable={false}
                    visible={this.props.billing_information.on_display}
                    height={this.state.is_expand ? 200 : 48}
                >
                </Drawer>

                {/* <Button type="primary" onClick={this.showDrawer}>
                    Open
               </Button> */}
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        billing_information: state.shipping_platform_single_order.form.billing_information
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_form_info: bindActionCreators(single_order_form.get_form_info, dispatch),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Create_order_page)
