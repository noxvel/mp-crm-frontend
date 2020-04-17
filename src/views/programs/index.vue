<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="100">
        <template slot-scope="{row}">{{ row.id }}</template>
      </el-table-column>
      <el-table-column label="Serial Number" width="120">
        <template slot-scope="{row}">{{ row.serialNumber }}</template>
      </el-table-column>
      <el-table-column label="Name" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Cost" width="120">
        <template slot-scope="{row}">{{ row.cost }}</template>
      </el-table-column>
      <el-table-column label="Description" align="center">
        <template v-slot="{row}">{{ row.description }}</template>
      </el-table-column>
      <el-table-column label="isActive" width="80" align="center">
        <template v-slot="{row}">{{ row.isActive }}</template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/program'
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
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        importance: undefined,
        title: undefined,
        type: undefined,
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
