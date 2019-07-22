<template>
  <v-card class="mx-auto mt-4 list_wrap">
    <!-- 列表功能區 -->
    <v-card-title color="#b8f1ed" class="list_title">
      <span class="title font-weight-light">抽獎列表</span>
      <v-spacer></v-spacer>
      <v-btn color="#b8f1cc" class="mb-2" @click="addItem">新增</v-btn>
    </v-card-title>
    <v-card-title color="#b8f1ed" class="list_title">
      <v-text-field
          v-model="search"
          append-icon="search"
          label="搜尋"
          single-line
          hide-details
          box
          flat
          clearable
          height="30"
      ></v-text-field>
    </v-card-title>
    <!-- /列表功能區 -->

    <!-- 列表區 -->
    <v-data-table
      :headers="headers"
      :items="list"
      :search="search"
      :custom-sort="customSort"
      :custom-filter="customFilter"
      :rows-per-page-items="[10,20,30,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
      class="elevation-1"
      disable-initial-sort
      dark
    >
      <template v-slot:no-data>小編太懶了，沒有留下任何東西</template>
      <template v-slot:no-results>唉呀，什麼都沒有呢</template>
      <template v-slot:items="props">
        <td>{{ props.item.value.account }}</td>
        <td class="text-xs-left">
          <a :href="props.item.value.link" id="redirect" target="_blank"><v-icon>link</v-icon></a>
        </td>
        <td class="text-xs-left">{{ props.item.value.tagnum }}</td>
        <td class="text-xs-left">{{ props.item.value.msg }}</td>
        <td class="text-xs-left">{{ props.item.value.duetime }}</td>
        <td class="text-xs-left">{{ props.item.value.prizetime }}</td>
        <td class="text-xs-left">{{ props.item.value.manager }}</td>
        <td class="text-xs-left">{{ props.item.value.isCheck }}</td>
        <td class="text-xs-left">{{ props.item.value.isPost }}</td>
        <td class="text-xs-left">{{ props.item.key }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
        </td>
      </template>
    </v-data-table>
    <!-- /列表區 -->

    <!-- 編輯彈窗 -->
    <v-dialog v-model="editDialog" fullscreen hide-overlay scrollable max-width="500px" :persistent="true">
      <v-card>
        <v-toolbar card :color="editState == 'modify' ? '#ff9b6a' : '#b8f1cc'">
          <v-toolbar-title v-if="editState == 'add'">新增項目</v-toolbar-title>
          <v-toolbar-title v-else-if="editState == 'modify'">編輯項目</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cancelEdit">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form v-model="editValid" ref="editForm">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.value.account" label="*抽獎帳號" :rules="formRules.account" required :disabled="editState != 'add'" box clearable></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.value.link" label="*抽獎連結" :rules="formRules.link" required box clearable></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    v-model="editedItem.value.tagnum"
                    :items="[0,1,2,3,4,5,6]"
                    label="標記人數"
                    box
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.value.msg" label="留言內容" :rules="formRules.msg" clearable box ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-menu
                    v-model="duetimeDateSwitch"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="editedItem.value.duetime"
                        label="留言到期日"
                        prepend-inner-icon="event"
                        readonly
                        v-on="on"
                        box
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="editedItem.value.duetime" no-title scrollable @input="duetimeDateSwitch = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-menu
                    v-model="prizetimeDateSwitch"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="editedItem.value.prizetime"
                        label="抽獎日"
                        prepend-inner-icon="event"
                        readonly
                        v-on="on"
                        :rules="formRules.prizetime"
                        box
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="editedItem.value.prizetime" no-title scrollable @input="prizetimeDateSwitch = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-checkbox v-model="editedItem.value.isPost" label="是否已留言" color="#b8f1cc"></v-checkbox>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.value.manager" label="*登記人帳號" :rules="formRules.manager" required :disabled="editState != 'add'" box clearable></v-text-field>
                  <v-checkbox v-model="isRememberManager" label="是否記憶登記人帳號" color="#b8f1cc"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-toolbar card color="#fff">
          <v-btn color="#fff" @click="cancelEdit">取消</v-btn>
          <v-btn color="#b8f1cc" @click="saveEdit">儲存</v-btn>
        </v-toolbar>
      </v-card>
    </v-dialog>
    <!-- /編輯彈窗 -->

    <!-- <v-btn color="#f1b8e4" @click="deleteList">列表內容移除</v-btn> -->
  </v-card>
</template>

<script>
  export default {
    data () {
      return{
        isRememberManager: false, //是否記憶登記人帳號
        search: '', //列表搜尋內容
        list: [], //列表array
        headers: [ //table title
          {
            text: '抽獎帳號',
            align: 'left',
            sortable: true,
            value: 'account'
          },
          { text: '抽獎連結', value: 'link', sortable: false },
          { text: '標記人數', value: 'tagnum', sortable: true },
          { text: '留言內容', value: 'msg', sortable: false },
          { text: '留言到期日', value: 'duetime', sortable: true },
          { text: '抽獎日', value: 'prizetime', sortable: true },
          { text: '登記人帳號', value: 'manager', sortable: true },
          { text: '是否上架', value: 'isCheck', sortable: true },
          { text: 'key', value: 'key', sortable: true },
          { text: '操作', value: 'operation', sortable: false }
        ],
        duetimeDateSwitch: false, //到期日日期選擇工具開關
        prizetimeDateSwitch: false, //抽獎日日期選擇工具開關
        editValid: false, //表單驗證狀況
        editDialog: false, //編輯彈窗開關
        editState: 'add', //編輯狀態: 新增add, 編輯modify
        defaultEditItem: { //預設項目
          'key': -1,
          'value': {
            account: '',
            link: '',
            tagnum: 0,
            msg: '',
            duetime: '',
            prizetime: '',
            manager: '',
            isCheck: true,
            isPost: false,
            createTime: ''
          }
        },
        editedItem: { //編輯項目
          'key': -1,
          'value': {
            account: '',
            link: '',
            tagnum: 0,
            msg: '',
            duetime: '',
            prizetime: '',
            manager: '',
            isCheck: true,
            isPost: false,
            createTime: ''
          }
        },
        formRules : { //表單驗證規則
          account : [
            v => !!v || '請輸入抽獎帳號',
            v => (/^[^\u4e00-\u9fa5]*$/).test(v) || '帳號不允許中文'
          ],
          link : [
            v => !!v || '請輸入抽獎連結',
            v => (v.indexOf('https://www.instagram.com/p/')>-1) || '該連結不是ig連結'
          ],
          msg: [
            v => !v || ((v.indexOf('@@')>-1) || '標記人的地方請用 @@ 表示')
          ],
          prizetime: [
            v => !(this.editedItem.value.duetime && v) || ( ((+new Date(v)) >= (+new Date(this.editedItem.value.duetime))) || '抽獎日需在留言到期日之後' )
          ],
          manager: [
            v => !!v || '請輸入您的IG帳號',
          ]
        }
      }
    },
    watch:{
      list(datas){ //列表內容變動時
        datas.forEach((v,i)=>{
          if(v.value.prizetime){
            var now = +new Date()
            var end = +new Date(`${v.value.prizetime} 00:00`)
            console.log(now,end)
            if(now - end > 0){ //過期
              v.value.isCheck = false
            }else{ //未過期
              v.value.isCheck = true
            }
          }
        })
      },
      editDialog(isOpen){ //編輯彈窗開啟時
        if(isOpen){
          if(localStorage.getItem('managerRemember')){
            this.isRememberManager = true
            if(this.editState=='add'){
              this.editedItem.value.manager = localStorage.getItem('managerRemember')
            }
          }
        }
      }
    },
    mounted(){
      appControl.firebase_DB.ref('main_list').on('value', (snapshot) => {
        console.log("總列表：",snapshot.val());
        if(snapshot.val()){
          let listObject = snapshot.val()
          let listValue = Object.values(listObject)
          let listKey = Object.keys(listObject)
          let listNew = new Array()
          for(let i=0;i<listKey.length;i++){
            listNew.push({
              'key': listKey[i],
              'value': listValue[i],
            })
          }
          this.list = listNew
        }
      });
    },
    methods: {
      customSort(items, index, isDescending){ //自定義排序
        console.log(index)
        if(index){
          items.sort((a, b) => {
            return isDescending ? (b.value[index] - a.value[index]) : (a.value[index] - b.value[index])
          })
        }else{
          items.sort((a,b)=>{
            var createA = +new Date(a.value.createTime) || 0
            var createB = +new Date(b.value.createTime) || 0
            console.log(createA)
            console.log(createB)
            return createB - createA
          })
        }
        return items;
      },
      customFilter(items, search, filter){ //自定義搜尋
        search = search.toString().toLowerCase()
        return items.filter(i => (
          Object.keys(i.value).some(j => filter(i.value[j], search))
        ))
      },
      addItem(){ //點擊新增
        this.editState = 'add'
        this.editDialog = true
        this.editedItem = _cloneDeep(this.defaultEditItem)
      },
      editItem(item){ //點擊編輯
        this.editState = 'modify'
        this.editDialog = true
        this.editedItem = _cloneDeep(item)
      },
      cancelEdit(){ //取消編輯
        this.editDialog = false
      },
      saveEdit(){ //儲存內容
        if( this.list && this.$refs.editForm.validate() ){
          //是否記憶登記人帳號
          if(this.isRememberManager){
            localStorage.setItem('managerRemember',this.editedItem.value.manager)
          }else{
            localStorage.removeItem('managerRemember')
          }
          //內容上傳firebase
          if(this.editState == 'add'){ //新增
            this.editedItem.value.createTime = new Date().toString()
            appControl.firebase_DB.ref('main_list').push(this.editedItem.value)
          }else if(this.editState == 'modify'){ //修改
            appControl.firebase_DB.ref(`main_list/${this.editedItem.key}`).update(this.editedItem.value)
          }
          this.editDialog = false
        }
      },
      deleteList(){ //刪除所有列表內容
        appControl.firebase_DB.ref('main_list').remove()
      }
    }
  }
</script>
<style lang="sass" scoped>
.list_wrap
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)
  border-radius: 8px
  overflow: hidden
  max-width: 95%
  .list_title
    padding-y: 0
</style>

