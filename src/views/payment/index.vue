<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="100">
        <template slot-scope="{row}">{{ row.id }}</template>
      </el-table-column>
      <el-table-column label="Contract" width="120">
        <template slot-scope="{row}">{{ row.treaty.series + row.treaty.number }}</template>
      </el-table-column>
      <el-table-column label="Type" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pay Date" align="center">
        <template v-slot="{row}">
          <span>{{ row.payDateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sum" width="80" align="center">
        <template v-slot="{row}">{{ row.sum }}</template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/payment'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    kind: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        importance: undefined,
        title: undefined,
        sort: '+id',
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.kind, this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
