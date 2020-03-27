<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Owner"
        style="width: 300px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>-->
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>-->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">Add</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >Export</el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">reviewer</el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <!-- <span>{{ row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.series + '-' + row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Owner" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.owner.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Program" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.program.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sum" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Comment" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="created by" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.createdBy }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>-->
      <el-table-column label="Payments" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.payments.length !== 0" class="link-type" @click="handleFetchPayments(row.payments)">{{ row.paymentsSum | parseSum(2) }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.isActive | statusFilter">{{ 'test' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="320" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Edit</el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">Publish</el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">Draft</el-button>
          <el-popover v-model="row.visibleDeletePopover" placement="top" width="200">
            <p>Are you sure to delete this?</p>
            <div style="text-align: center; margin: 0">
              <el-button size="mini" type="text" @click="row.visibleDeletePopover = false">cancel</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(row,$index)">confirm</el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger">Delete</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Program" prop="program">
          <el-select v-model="temp.program" class="filter-item" placeholder="Please select">
            <el-option v-for="item in programList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="date">
          <el-date-picker v-model="temp.date" type="date" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Sum" prop="sum">
          <el-input-number v-model="temp.sum" :precision="2" :step="0.1" :max="999999999" :min="1" :controls="false" />
        </el-form-item>
        <el-form-item label="Owner" prop="owner">
          <el-select v-model="temp.owner" class="filter-item" placeholder="Please select">
            <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>-->
        <el-form-item label="Comment">
          <el-input v-model="temp.comment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPaymentsVisible" title="Payments">
      <el-table :data="paymentsData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="type" label="Type" />
        <el-table-column prop="payDateTime" label="Pay datetime">
          <template v-slot="{row}">
            <span>{{ row.payDateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sum" label="Sum" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPaymentsVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, create, update, deleteById } from '@/api/contract'
import { fetchList as fetchProgramList } from '@/api/program'
import { fetchList as fetchPersonList } from '@/api/person'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Contract',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      // const statusMap = {
      //   published: 'success',
      //   draft: 'info',
      //   deleted: 'danger'
      // }
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    },
    parseSum(num, n) {
      return num.toFixed(n)
    }
  },
  data() {
    return {
      programList: null,
      personList: null,
      list: null,
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        type: undefined,
        sort: '-id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        sum: 0,
        date: new Date(),
        owner: '',
        program: '',
        comment: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPaymentsVisible: false,
      paymentsData: [],
      rules: {
        program: [
          { required: true, message: 'program is required', trigger: 'change' }
        ],
        owner: [
          { required: true, message: 'owner is required', trigger: 'change' }
        ],
        date: [
          {
            type: 'date',
            required: true,
            message: 'date is required',
            trigger: 'change'
          }
        ],
        sum: [
          {
            type: 'number',
            required: true,
            message: 'sum is required',
            trigger: 'blur'
          }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {},
  created() {
    this.getList()
    this.getPrograms()
    this.getPersons()
  },
  methods: {
    getPrograms() {
      fetchProgramList().then(response => {
        this.programList = response.data.items
      })
    },
    getPersons() {
      fetchPersonList().then(response => {
        this.personList = response.data.items
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        this.list.forEach(el => {
          el.visiblePopoverDelete = false
          el.paymentsSum =
            el.payments.length !== 0 ? this.getPaymentsSum(el) : 0
        })
        this.listLoading = false
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        sum: 0,
        date: new Date(),
        owner: '',
        program: '',
        comment: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.createdBy = 'vue-element-admin'
          const tempData = this.createRequestData(this.temp)
          create(tempData).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.date = new Date(this.temp.date)
      this.temp.owner = this.temp.owner.id
      this.temp.program = this.temp.program.id

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          const tempData = this.createRequestData(this.temp)
          update(this.temp.id, tempData).then(() => {
            this.dialogFormVisible = false
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteById(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        // this.list.splice(index, 1)
        this.getList()
      })
    },
    handleFetchPayments(payments) {
      this.paymentsData = payments
      this.dialogPaymentsVisible = true
      // fetchPayments(contractId).then(response => {
      //   this.paymentsData = response.data.items
      //   this.dialogPaymentsVisible = true
      // })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['date', 'number', 'series', 'owner', 'program', 'sum']
        const filterVal = [
          'date',
          'number',
          'series',
          'owner',
          'program',
          'sum'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    createRequestData(temp) {
      return {
        sum: temp.sum,
        date: temp.date,
        owner: temp.owner,
        program: temp.program,
        comment: temp.comment
      }
    },
    getPaymentsSum(el) {
      console.log(el.payments)
      return el.payments.reduce((a, b) => {
        return a + b.sum
      }, 0)
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else if (j === 'owner' || j === 'program') {
            return v[j].name
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
