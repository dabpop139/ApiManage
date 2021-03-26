<template>
  <div id="app">
        <el-container class="fheight">
            <el-header class="eheader">
                <div class="layout-top">
                    <div class="disflex left-opts">
                        <div class="flex center elogo">
                            <el-button type="info" size="small" icon="el-icon-location" circle>
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-container class="fheight">
                <el-aside class="easide" width="230px">
                    <div class="el-scrollbar">
                        <div class="project-info">
                            <div class="project-title">
                                <el-select v-model="projectid" @change="projectChange">
                                    <el-option v-for="(item, idx) in projectlist" :key="idx" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                                <!-- <label class="name">{{projectname}}</label> -->
                            </div>
                        </div>
                        <div class="api-searcher">
                            <el-input
                                placeholder="搜索 名称 和 URL"
                                v-model="keyword"
                                @keyup.enter.native="searchResult">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </div>
                        <div class="mclear"></div>
                        <div class="api-toolbar">
                            <div class="right-opts">
                                <a href="javascript:;"><i class="el-icon el-icon-folder-add" @click="catalogOperate([0, '', 0, 'add'])"></i></a>&nbsp;
                                <a href="javascript:;" @click="createNew"><i class="el-icon el-icon-edit"></i></a>
                            </div>
                            <div class="mclear"></div>
                        </div>
                        <div class="api-catalog">
                            <el-menu
                                default-active="1"
                                :default-openeds="cateOpeneds"
                                class="api-catalog-item"
                                text-color="#A9A9A9"
                                background-color="#424242"
                                active-text-color="#FFD04B">
                                <el-submenu :index="cate.id+``" v-for="(cate, ind) in subCates" :key="ind">
                                    <template slot="title">
                                        <el-dropdown @command="catalogOperate">
                                            <span class="el-dropdown-link">
                                                <i class="el-icon-folder"></i>
                                            </span>
                                            <el-dropdown-menu slot="dropdown" class="api-catalog-dropsele">
                                                <el-dropdown-item :command="[cate.id, cate.name, cate.ord, 'edit']">编辑</el-dropdown-item>
                                                <el-dropdown-item :command="[cate.id, cate.name, cate.ord, 'del']">删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                        <span>{{cate.name}}</span>
                                    </template>
                                    <el-menu-item :index="ind+`-`+item.id" v-for="(item, idx) in cate.dlists" :key="idx">
                                        <label :class="`method `+item.reqmethod">{{item.reqmethod}}</label>
                                        <label class="name" :title="item.apiname" @click="openLink(item.id)">{{item.apiname}}</label>
                                        <label class="setting">
                                            <el-dropdown trigger="click" @command="apiItemOperate">
                                                <span class="el-dropdown-link">
                                                    <i class="el-icon el-icon-more"></i>
                                                </span>
                                                <el-dropdown-menu slot="dropdown" class="api-catalog-item-dropsele">
                                                    <el-dropdown-item :command="[item.id, 'copy']">复制</el-dropdown-item>
                                                    <el-dropdown-item :command="[item.id, 'del']">删除</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </label>
                                    </el-menu-item>
                                </el-submenu>
                            </el-menu>
                        </div><!-- api-catalog -->
                        <div class="mt-4">&nbsp;</div>
                        <div class="mt-4">&nbsp;</div>
                    </div><!-- el-scrollbar -->
                </el-aside>
                <el-main class="emain">
                    <!-- <keep-alive>
                        <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view> -->
                    <el-tabs v-model="mainTabsCurr" type="card" closable @tab-remove="removeTab" @tab-click="switchTab">
                        <el-tab-pane
                            v-for="(etabItem, index) in editableTabs"
                            :key="etabItem.name"
                            :label="etabItem.title"
                            :name="etabItem.name"
                        >
                            <div class="main-area panel" :elem-index="index">
                                <div class="panel-title">
                                    <el-row>
                                        <el-col :span="18">
                                            <div class="project-title">
                                                <el-input size="small" placeholder="请输接口名称" v-model="apiname" class="input-with-select">
                                                    <el-select v-model="reqscheme" slot="prepend" placeholder="请选择">
                                                        <el-option label="HTTP" value="HTTP"></el-option>
                                                        <el-option label="WEBSOCKET" value="WEBSOCKET"></el-option>
                                                    </el-select>
                                                </el-input>
                                            </div>
                                        </el-col>
                                        <el-col :span="6" class="pl-3">
                                            分类：
                                            <el-select size="small" v-model="cateid" placeholder="请选择">
                                                <el-option label="请选择" value="0"></el-option>
                                                <el-option v-for="(cate, idx) in subCates" :key="idx" :label="cate.name" :value="cate.id"></el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </div><!-- panel-title -->
                                <div class="panel-content">
                                    <div class="request-uri">
                                        <el-row>
                                            <el-col :span="22">
                                                <el-input placeholder="请输入接口地址" v-model="apiuri" spellcheck="false" class="input-with-select">
                                                    <el-select v-model="reqmethod" slot="prepend" placeholder="请选择">
                                                        <el-option label="POST" value="POST"></el-option>
                                                        <el-option label="GET" value="GET"></el-option>
                                                        <el-option label="PUT" value="PUT"></el-option>
                                                        <el-option label="PATCH" value="PATCH"></el-option>
                                                        <el-option label="DELETE" value="DELETE"></el-option>
                                                        <el-option label="COPY" value="COPY"></el-option>
                                                        <el-option label="HEAD" value="HEAD"></el-option>
                                                        <el-option label="OPTIONS" value="OPTIONS"></el-option>
                                                        <el-option label="LINK" value="LINK"></el-option>
                                                        <el-option label="UNLINK" value="UNLINK"></el-option>
                                                        <el-option label="PROPFIND" value="PROPFIND"></el-option>
                                                        <el-option label="VIEW" value="VIEW"></el-option>
                                                    </el-select>
                                                    <el-button slot="append" icon="el-icon-s-promotion" @click="sendForm">发送</el-button>
                                                </el-input>
                                            </el-col>
                                            <el-col :span="2">
                                                <div class="pl-2"><el-button icon="el-icon-s-claim" @click="saveForm">保存</el-button></div>
                                            </el-col>
                                            <div class="mclear"></div>
                                        </el-row>
                                    </div>

                                    <el-tabs v-model="panelActive" class="request-payload mt-1">
                                        <el-tab-pane label="模拟" name="request" class="panel-requset">
                                            <div class="box01">
                                                <div class="v1">
                                                    <el-checkbox label="Header" v-model="reqHeaderChk"></el-checkbox>
                                                    <el-checkbox label="Body" v-model="reqBodyChk"></el-checkbox>
                                                </div>
                                                <div class="v2">
                                                    <el-select size="mini" v-model="bodytype" placeholder="请选择">
                                                        <el-option label="x-www-form-urlencoded" value="x-www-form-urlencoded"></el-option>
                                                        <el-option label="form-data" value="form-data"></el-option>
                                                        <el-option label="raw" value="raw"></el-option>
                                                    </el-select>
                                                </div>
                                                <div class="mclear"></div>
                                            </div>

                                            <el-collapse v-model="collapseAcitves" class="collapse-box">
                                                <el-collapse-item name="req-header" v-if="reqHeaderChk">
                                                    <template slot="title">
                                                        <el-tag size="medium">Header</el-tag>
                                                    </template>
                                                    <div>
                                                        <el-input
                                                            type="textarea"
                                                            :autosize="{minRows: 4, maxRows: 100}"
                                                            spellcheck="false"
                                                            placeholder="请输入内容"
                                                            v-model="reqHeader">
                                                        </el-input>
                                                    </div>
                                                </el-collapse-item>
                                                <el-collapse-item name="req-body" class="req-body" v-if="reqBodyChk">
                                                    <template slot="title">
                                                        <el-tag size="medium" type="success" class="mr-2">Body</el-tag>
                                                        <el-select size="mini" v-model="bodyrawtype" placeholder="请选择" @change="bodytypeChange" v-if="bodytype=='raw'">
                                                            <el-option label="JSON (application/json)" value="json"></el-option>
                                                            <el-option label="XML (text/xml)" value="xml"></el-option>
                                                            <el-option label="JavaScript (application/javascript)" value="javascript"></el-option>
                                                            <el-option label="TEXT (text/plain)" value="plain"></el-option>
                                                            <el-option label="HTML (text/html)" value="html"></el-option>
                                                            <el-option label="TEXT" value="text"></el-option>
                                                        </el-select>
                                                    </template>
                                                    <div>
                                                        <codemirror v-model="reqBody" :options="cmOptions" height="6" />
                                                        <!-- <el-input
                                                            type="textarea"
                                                            :autosize="{minRows: 4, maxRows: 100}"
                                                            spellcheck="false"
                                                            placeholder="请输入内容"
                                                            v-model="reqBody">
                                                        </el-input> -->
                                                    </div>
                                                </el-collapse-item>
                                            </el-collapse>
                                            
                                        </el-tab-pane>
                                        <el-tab-pane label="文档" name="docs" class="panel-docs">
                                            <div class="mt-1">接口字段文档</div>
                                        </el-tab-pane>
                                    </el-tabs>

                                    <div class="request-response">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>Response</span>
                                                <el-tag size="medium" class="ml-2" type="warning" v-if="respStatus">Status:{{respStatus}}</el-tag>
                                                <el-tag size="medium" class="ml-1" v-if="respExtime">Time:{{respExtime}}ms</el-tag>
                                                <el-tag size="medium" class="ml-1 sbtn" type="info" v-if="respHeader" @click="switchShowRespHeaders">Headers</el-tag>
                                            </div>
                                            <div class="result" v-if="!showRespHeaders">
                                                <json-viewer
                                                    :value="respDataJson"
                                                    :expand-depth=5
                                                    copyable
                                                    v-if="respDataJson">
                                                    <!-- https://github.com/chenfengjw163/vue-json-viewer#example -->
                                                </json-viewer>
                                                <div v-if="!respDataJson">
                                                    <div class="response-datatext-cbtn">
                                                        <el-button-group>
                                                            <el-button plain size="mini" @click="changeRespDataViewMode('raw')">Raw</el-button>
                                                            <el-button plain size="mini" @click="changeRespDataViewMode('preview')">Preview</el-button>
                                                        </el-button-group>
                                                    </div>
                                                    <div class="response-datatext" v-show="respDataViewMode=='raw'">{{respData}}</div>
                                                    <div class="response-datatext" v-show="respDataViewMode=='preview'" :id="'R_iframeVessel'+etabItem.name"><iframe class="R_iframe" :id="'R_iframe'+etabItem.name" name="R_iframe" width="100%" height="100%" src="about:blank" frameborder="0" seamless=""></iframe></div>
                                                </div>
                                            </div>
                                            <div class="result" v-if="showRespHeaders">
                                                <div class="response-headers" v-html="respHeader"></div>
                                            </div>
                                        </el-card>
                                    </div>
                                </div>
                            </div><!-- panel -->
                        </el-tab-pane>
                    </el-tabs>
                </el-main>

                <el-dialog title="分类名称" width="20%" :visible.sync="catalogDialogVisible">
                    <div class="el-row">
                        <div class="el-col el-col-14">
                            <el-input size="small" v-model="editCatalogName" autocomplete="off"></el-input>
                        </div>
                        <div class="el-col el-col-4">
                            <div class="pl-3 pt-1">排序：</div>
                        </div>
                        <div class="el-col el-col-6">
                            <el-input size="small" v-model="editCatalogOrd" autocomplete="off"></el-input>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small" @click="catalogDialogAct('cancel')">取 消</el-button>
                        <el-button type="primary" size="small" @click="catalogDialogAct('submit')">确 定</el-button>
                    </div>
                </el-dialog>
            </el-container>
        </el-container>
  </div>
</template>

<script>
/* eslint-disable */
import COMJS from '@/libs/common'
import {
    Container, Header, Aside, Main,
    Row, Col,
    Loading, Message, MessageBox, Dialog,
    Menu, Submenu, MenuItemGroup, MenuItem,
    Tabs, TabPane, Card, Collapse, CollapseItem,
    Dropdown, DropdownMenu, DropdownItem, Button, ButtonGroup, Input, Select, Option, Checkbox, Tag,
} from 'element-ui'
import { codemirror } from 'vue-codemirror'
import JsonViewer from 'vue-json-viewer'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

export default {
    name: 'app',
    components: {
        elContainer: Container,
        elHeader: Header,
        elAside: Aside,
        elMain: Main,

        elRow: Row,
        elCol: Col,

        elMenu: Menu,
        elSubmenu: Submenu,
        elMenuItemGroup: MenuItemGroup,
        elMenuItem: MenuItem,

        elDialog: Dialog,

        elTabs: Tabs,
        elTabPane: TabPane,
        elCard: Card,
        elCollapse: Collapse,
        elCollapseItem: CollapseItem,
        
        elDropdown: Dropdown,
        elDropdownMenu: DropdownMenu,
        elDropdownItem: DropdownItem,
        elButton: Button,
        elButtonGroup: ButtonGroup,
        elInput: Input,
        elSelect: Select,
        elOption: Option,
        elCheckbox: Checkbox,
        elTag: Tag,

        codemirror,
        JsonViewer,
    },
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            isRouterAlive: true,
            fullscreenLoading: false,
            cateOpeneds: [],
            keyword: '',

            mainTabsCurr: '1',
            editableTabs: [
                {
                    aid: 0,
                    title: '新建接口',
                    name: '1',
                }
            ],
            tabIndex: 1,
            catalogDialogVisible: false,

            cmOptions: {
                tabSize: 4,
                mode: 'text/javascript',
                lineNumbers: true,
                line: true,
                lineWrapping: true,
                extraKeys: {
                    'Ctrl-/': 'toggleComment' // 没用
                }
            },

            // 缓存的API IDs数组
            cacheApiIds: {},

            editCatalogId: 0,
            editCatalogName: '',
            editCatalogOrd: 0,
            editCatalogAct: 'add',
            subCates: {},

            projectlist: [],
            // projectname: '',
            projectid: '', // 项目ID
            cateid: '0', // 类型ID

            aid: 0,
            apiname: '',
            reqscheme: 'HTTP',
            apiuri: '',
            reqmethod: 'POST',
            bodytype: 'x-www-form-urlencoded',
            bodyrawtype: 'json',

            panelActive: 'request',
            collapseAcitves: ['req-header', 'req-body'],

            reqHeaderChk: true,
            reqBodyChk: true,

            reqHeader: '',
            reqBody: '',

            showRespHeaders: false,
            respStatus: '',
            respExtime: '',
            respHeader: '',
            respData: '',
            respDataJson: null,
            respDataViewMode: 'raw'
        }
    },
    methods: {
        projectChange() {
            localStorage.setItem('projectid', this.projectid)
            this.fetchCates()
        },
        addTab(targetName, aid = 0) {
            if (aid != 0) {
                let hasIs = false
                this.editableTabs.forEach((tab, index) => {
                    if (tab.aid === aid) {
                        hasIs = true
                        this.mainTabsCurr = tab.name
                        return
                    }
                })
                if (hasIs) {
                    this.switchTab()
                    return
                }
            }

            let newTabName = ++this.tabIndex + ''
            this.editableTabs.push({
                aid: aid,
                title: targetName,
                name: newTabName,
            })
            this.mainTabsCurr = newTabName
        },
        removeTab(targetName) {
            let tabs = this.editableTabs
            let activeName = this.mainTabsCurr
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1]
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                })
            }

            this.mainTabsCurr = activeName
            this.editableTabs = tabs.filter(tab => tab.name !== targetName)
            this.switchTab()
        },
        switchTab() {
            this.editableTabs.forEach((tab, index) => {
                if (tab.name === this.mainTabsCurr) {
                    if (tab.aid == 0) {
                        this.resetRequest()
                        this.resetRespone()
                    } else {
                        this.openLink(tab.aid, false)
                    }
                    return
                }
            })
        },
        // 显示分类操作对话框
        catalogOperate(arr) {
            let cateid = arr[0]
            let name   = arr[1]
            let ord    = arr[2]
            let act    = arr[3]
            // act: add del edit
            
            this.editCatalogId = cateid
            this.editCatalogName = name
            this.editCatalogOrd = ord
            this.editCatalogAct = act

            if (act == 'del') {
                this.catalogActHandle(act)
                return
            }
            // 显示对话框
            this.catalogDialogVisible = true
        },
        // 分类操作对话框动作(提交/取消)
        catalogDialogAct(actname) {
            if (actname == 'cancel') {
                this.catalogDialogVisible = false
                return
            }
            if (this.editCatalogAct == 'add' || this.editCatalogAct == 'edit') {
                this.catalogActHandle('save')
            }
        },
        // 分类操作行为处理
        catalogActHandle(actname) {
            // actname: del save
            let projectid = this.projectid
            let cateid = this.editCatalogId
            let name = this.editCatalogName
            let ord = this.editCatalogOrd

            if (actname != 'del' && name.trim() == '') {
                Message.warning('分类名称不能为空')
                return
            }
            
            COMJS.doAjax({
                url: this.$configSite.apicomm+'apictrl/category',
                data: {
                    projectid: projectid,
                    cateid: cateid,
                    act: actname,
                    name: name,
                    ord: ord,
                },
            }, 'POST',
            response => {
                this.catalogDialogVisible = false
                let resp = response.data
                if (resp.code == 1) {
                    this.fetchCates()
                    Message.success(resp.msg !== '' ? resp.msg : '操作成功')
                } else {
                    MessageBox.alert(resp.msg, '错误 :-(', {})
                }
                resp = null
                return false
            },
            error => {
                this.catalogDialogVisible = false
                return true
            })
        },
        apiItemOperate(arr) {
            let aid = arr[0]
            let act = arr[1]

            COMJS.doAjax({
                url: this.$configSite.apicomm+'apictrl/operate',
                data: {
                    aid: aid,
                    act: act,
                },
            }, 'POST',
            response => {
                let resp = response.data
                if (resp.code == 1) {
                    // Message.success(resp.msg !== '' ? resp.msg : '操作成功')
                    this.fetchCates()
                } else {
                    MessageBox.alert(resp.msg, '错误 :-(', {})
                }
                resp = null
                return false
            },
            error => {
                return true
            })
        },
        openLink(aid, addtab = true) {
            let loadingInstance = Loading.service({background: 'rgb(255 255 255 / 0)'})
            
            let apicache = localStorage.getItem('apicache-'+aid)
            if (apicache) {
                let jsonData = JSON.parse(apicache)
                this.setTabElemData(jsonData, addtab)
                loadingInstance.close()
                return
            }

            COMJS.doAjax({
                url: this.$configSite.apicomm+'apictrl/apidata',
                data: { aid: aid },
            }, 'GET',
            response => {
                let resp = response.data
                if (resp.code == 1) {
                    this.cacheApiIds[aid] = ''
                    localStorage.setItem('cache_api_ids', JSON.stringify(this.cacheApiIds))
                    this.setTabElemData(resp.data, addtab)
                } else {
                    MessageBox.alert(resp.msg, '错误 :-(', {})
                }
                loadingInstance.close()
                resp = null
                return false
            },
            error => {
                // console.log(error)
                loadingInstance.close()
                return true
            })
        },
        searchResult() {
            if (this.keyword == '') {
                this.cateOpeneds = []
            }
            this.fetchCates(this.keyword)
        },
        renewTabName() {
            this.editableTabs.forEach((tab, index) => {
                if (tab.name === this.mainTabsCurr) {
                    this.editableTabs[index].title = this.apiname
                    return
                }
            })
        },
        resetRequest() {
            this.cateid = '0' // 类型ID;

            this.aid = 0
            this.apiname = ''
            this.reqscheme = 'HTTP'
            this.apiuri = ''
            this.reqmethod = 'POST'
            this.bodytype = 'x-www-form-urlencoded'
            this.bodyrawtype = 'json'

            this.panelActive = 'request'

            this.reqHeaderChk = true
            this.reqBodyChk = true

            this.reqHeader = ''
            this.reqBody = ''
        },
        resetRespone() {
            this.showRespHeaders = false
            this.respStatus = ''
            this.respExtime = ''
            this.respHeader = ''
            this.respData = ''
            this.respDataJson = null
            this.respDataViewMode = 'raw'
        },
        // 赋值到VueData
        setTabElemData (data, addtab) {
            // 缓存现在的值
            let jsonData = {}
            jsonData.id = this.aid
            jsonData.projectid = this.projectid
            jsonData.cateid = this.cateid

            jsonData.apiname = this.apiname
            jsonData.reqscheme = this.reqscheme
            jsonData.apiuri = this.apiuri

            jsonData.reqmethod = this.reqmethod
            jsonData.bodytype = this.bodytype
            jsonData.bodyrawtype = this.bodyrawtype

            jsonData.rheader_chk = this.reqHeaderChk
            jsonData.rbody_chk = this.reqBodyChk

            jsonData.rheader = this.reqHeader
            jsonData.rbody = this.reqBody

            jsonData.respraw = this.respData
            localStorage.setItem('apicache-'+this.aid, JSON.stringify(jsonData))

            this.resetRespone()

            // 设置新的值
            this.aid = data.id
            this.projectid = data.projectid
            this.cateid = data.cateid

            this.apiname = data.apiname
            this.reqscheme = data.reqscheme
            this.apiuri = data.apiuri

            this.reqmethod = data.reqmethod
            this.bodytype = data.bodytype
            this.bodyrawtype = data.bodyrawtype

            this.reqHeaderChk = data.rheader_chk
            this.reqBodyChk = data.rbody_chk

            this.reqHeader = data.rheader
            this.reqBody = data.rbody

            this.respData = data.respraw
            
            if (this.respData) {
                let strpre = this.respData.substring(0, 1)
                let pattern = /<\/\S+>/g
                if (strpre == '{' || strpre =='[') {
                     // JSON查看模式
                    let jparse = null
                    try {
                        jparse = JSON.parse(this.respData)
                    } catch (err) {

                    }
                    this.respDataJson = jparse
                } else if(pattern.test(this.respData)) {
                    this.respDataViewMode = 'preview' // HTML查看模式
                    setTimeout(() => {
                        this.changeRespDataViewMode('preview')
                    }, 100)
                }
            }

            if (addtab == true) {
                this.addTab(data.apiname, this.aid)
            }

            this.cmModeSwitch()
        },
        // 新建API
        createNew() {
            this.resetRequest()
            this.resetRespone()

            this.addTab('新建接口')
        },
        sendHTTP() {
            let act = 'send'
            if (this.apiuri.trim() == '') {
                Message.warning('接口地址不能为空')
                return
            }

            let loadingInstance = Loading.service({background: 'rgb(255 255 255 / 0)'})
            this.resetRespone()
            
            COMJS.doAjax({
                url: this.$configSite.apicomm+'apictrl/handle',
                data: {
                    act: act,

                    projectid: this.projectid,
                    cateid: this.cateid,

                    aid: this.aid,
                    apiname: this.apiname,
                    reqscheme: this.reqscheme,
                    apiuri: this.apiuri,

                    reqmethod: this.reqmethod,
                    bodytype: this.bodytype,
                    bodyrawtype: this.bodyrawtype,

                    rheader_chk: this.reqHeaderChk,
                    rbody_chk: this.reqBodyChk,

                    rheader: this.reqHeader,
                    rbody: this.reqBody,
                },
            }, 'POST',
            response => {
                let resp = response.data
                if (resp.code == 1) {
                    // Message.success(resp.msg !== '' ? resp.msg : '操作成功')
                    this.respData = resp.data.raw
                    let strpre = this.respData.substring(0, 1)
                    let pattern = /<\/\S+>/g
                    if (strpre == '{' || strpre =='[') {
                        let jparse = null
                        try {
                            jparse = JSON.parse(this.respData)
                        } catch (err) {

                        }
                        this.respDataJson = jparse
                    } else if(pattern.test(this.respData)) {
                        this.respDataViewMode = 'preview'
                        setTimeout(() => {
                            this.changeRespDataViewMode('preview')
                        }, 100)
                    }
                    this.respStatus = resp.data.status
                    this.respExtime = resp.data.extime
                    this.respHeader = resp.data.header
                } else {
                    MessageBox.alert(resp.msg, '错误 :-(', {})
                }
                loadingInstance.close()
                resp = null
                return false
            },
            error => {
                loadingInstance.close()
                return true
            })

            // setTimeout(() => { Message.closeAll() }, 1000)
        },
        sendWebSocket() {
            if (this.apiuri.trim() == '') {
                Message.warning('接口地址不能为空')
                return
            }
            let formatApiurl = this.apiuri
            if (formatApiurl.substr(formatApiurl.length-1, 1) != '/') {
                formatApiurl = formatApiurl+'/'
            }

            if (typeof window.webSocketEl != 'undefined') {
                if (window.webSocketEl.readyState == WebSocket.OPEN && window.webSocketEl.url != formatApiurl) {
                    window.webSocketEl.close(4999)
                    window.webSocketEl = new WebSocket(this.apiuri)
                }
                if (window.webSocketEl.readyState == WebSocket.CLOSED) {
                    window.webSocketEl = new WebSocket(this.apiuri)
                }
            } else {
                window.webSocketEl = new WebSocket(this.apiuri)
            }

            let wsOnOpen = () => {
                window.webSocketEl.send(this.reqBody)
            }
            let wsOnMessage = (evt) => {
                Message.success('接收到WebSocket消息')
                this.respData = evt.data
                let strpre = this.respData.substring(0, 1)
                let pattern = /<\/\S+>/g
                if (strpre == '{' || strpre =='[') {
                    let jparse = null
                    try {
                        jparse = JSON.parse(this.respData)
                    } catch (err) {

                    }
                    this.respDataJson = jparse
                } else if(pattern.test(this.respData)) {
                    this.respDataViewMode = 'preview'
                    setTimeout(() => {
                        this.changeRespDataViewMode('preview')
                    }, 100)
                }
            }
            let wsOnClose = () => {
                // Message.warning('WebSocket连接断开')
            }
            let wsOnError = () => {
                Message.warning('服务连接失败')
            }
            window.webSocketEl.onopen = wsOnOpen
            window.webSocketEl.onmessage = wsOnMessage
            window.webSocketEl.onclose = wsOnClose
            window.webSocketEl.onerror = wsOnError

            if (window.webSocketEl.readyState == WebSocket.OPEN) {
                window.webSocketEl.send(this.reqBody)
            }
        },
        sendForm() {
            // console.log('sendForm')
            // return
            if (this.reqscheme == 'HTTP') {
                this.sendHTTP()
            }
            if (this.reqscheme == 'WEBSOCKET') {
                this.sendWebSocket()
            }
        },
        saveForm() {
            if (this.cateid == '0') {
                Message.warning('请选择一个分类')
                return
            }
            if (this.apiname.trim() == '') {
                Message.warning('接口名称不能为空')
                return
            }
            if (this.apiuri.trim() == '') {
                Message.warning('接口地址不能为空')
                return
            }
            let act = 'save'

            COMJS.doAjax({
                url: this.$configSite.apicomm+'apictrl/handle',
                data: {
                    act: act,
                    
                    projectid: this.projectid,
                    cateid: this.cateid,

                    aid: this.aid,
                    apiname: this.apiname,
                    reqscheme: this.reqscheme,
                    apiuri: this.apiuri,

                    reqmethod: this.reqmethod,
                    bodytype: this.bodytype,
                    bodyrawtype: this.bodyrawtype,

                    rheader_chk: this.reqHeaderChk,
                    rbody_chk: this.reqBodyChk,

                    rheader: this.reqHeader,
                    rbody: this.reqBody,
                },
            }, 'POST',
            response => {
                let resp = response.data
                if (resp.code == 1) {
                    Message.success(resp.msg !== '' ? resp.msg : '操作成功')
                    this.aid = resp.data.aid
                } else {
                    MessageBox.alert(resp.msg, '错误 :-(', {})
                }
                resp = null
                this.renewTabName()
                this.fetchCates()
                return false
            },
            error => {
                return true
            })

            // setTimeout(() => { Message.closeAll() }, 3000)
        },
        fetchCates(param) {
            let keyword = ''
            let loadingInstance
            if (typeof param != 'undefined') {
                keyword = param
            }
            if (keyword !='') {
                loadingInstance = Loading.service({background: 'rgb(255 255 255 / 0)'})
            }
            COMJS.doAjax({
                url: this.$configSite.apicomm+'apictrl/category',
                data: { projectid: this.projectid, keyword: keyword},
            }, 'GET',
            response => {
                let resp = response.data
                if (resp.code == 1) {
                    // this.projectname = resp.data.project.name
                    this.subCates = resp.data.subcates
                } else {
                    MessageBox.alert(resp.msg, '错误 :-(', {})
                }
                resp = null
                if (keyword !='') {
                    let tempArr = []
                    this.subCates.forEach((tab, index) => {
                        tempArr.push(tab.id+'')
                    })
                    this.cateOpeneds = tempArr
                    loadingInstance.close()
                }
                return false
            },
            error => {
                if (keyword !='') {
                    loadingInstance.close()
                }
                return true
            })
        },
        cmModeSwitch() {
            if (this.bodyrawtype == 'json') {
                this.cmOptions.mode = 'application/json'
            } else if(this.bodyrawtype == 'javascript') {
                this.cmOptions.mode = 'text/javascript'
            } else {
                this.cmOptions.mode = 'text/javascript'
            }
        },
        bodytypeChange() {
            this.cmModeSwitch()
        },
        switchShowRespHeaders() {
            this.showRespHeaders = !this.showRespHeaders
        },
        changeRespDataViewMode(mode) {
            if (mode == 'preview') {
                let ind = parseInt(this.mainTabsCurr)
                let iframeDoc = window.document.getElementById('R_iframe'+ind).contentDocument || window.document.frames['R_iframe'+ind].document
                iframeDoc.body.innerHTML = this.respData
                setTimeout(() => {
                    window.document.getElementById('R_iframeVessel'+ind).style.height = iframeDoc.body.scrollHeight+'px'
                }, 200)
            }
            this.respDataViewMode = mode
        },
        keyboardEvent(event) {
            if (event.keyCode === 83 && event.ctrlKey) {
                this.saveForm()
                event.preventDefault()
                event.returnValue = false
                return false
            }

            if (event.keyCode == 13 && event.ctrlKey) {
                this.sendForm()
                event.preventDefault()
                event.returnValue = false
                return false
            }
        },
        reload() {
            // 重新加载 刷新页面
            this.isRouterAlive = false
            this.$nextTick(function() {
                this.isRouterAlive = true;
            })
        }
    },
    beforeMount() {
        COMJS.doAjax({
            url: this.$configSite.apicomm+'apictrl/project',
        }, 'GET',
        response => {
            let resp = response.data
            if (resp.code == 1) {
                this.projectlist = resp.data
                let projectid = localStorage.getItem('projectid')
                if (projectid) {
                    this.projectid = parseInt(projectid)
                } else {
                    this.projectid = 1
                }
                this.fetchCates()
            } else {
                MessageBox.alert(resp.msg, '错误 :-(', {})
            }
            resp = null
            return false
        },
        error => {
            return true
        })

        let allCacheApiIds = localStorage.getItem('cache_api_ids')
        if (allCacheApiIds) {
            let apiIds = JSON.parse(allCacheApiIds)
            Object.keys(apiIds).forEach((key) => {
                localStorage.removeItem('apicache-'+key)
            })
            localStorage.removeItem('cache_api_ids')
        }
    },
    mounted() {
        document.addEventListener('keydown', this.keyboardEvent)
    }
}
</script>

<style>
@import "./assets/css/master.css";
</style>