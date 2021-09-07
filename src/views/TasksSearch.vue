<template>
  <main>
    <h1>Tasks Search view</h1>
    <div class="">
      <button @click="search(0)">Search</button>
      <table>
        <tr>
          <td>title</td>
          <td>description</td>
          <td>budget</td>
          <td>proposal count</td>
          <td>platforms</td>
          <td>added time</td>
        </tr>
        <tr v-for="data in showListData" :key="data.title">
          <td>{{ data.title }}</td>
          <td>{{ data.description }}</td>
          <td>{{ data.budget.value }},currency:{{ data.budget.currency }}</td>
          <td>{{ data.proposalCount }}</td>
          <td>{{ data.platforms.toString() }}</td>
          <td>{{ data.addedTime }}</td>
        </tr>
      </table>
    </div>
    <input
      type="number"
      v-model="listQuery.budgetGreaterEqual"
      placeholder="budgetGreaterEqual"
    />
    <input
      type="number"
      v-model="listQuery.budgetLowerEqual"
      placeholder="budgetLowerEqual"
    />
    <ul class="pagination-block">
      <li v-for="showData in paginationStore" :key="showData.title">
        <div
          :class="
            showData.active === true
              ? 'active pagination-block-list'
              : 'pagination-block-list'
          "
        >
          <a :href="showData.url" @click="search(showData.page)">{{
            showData.title
          }}</a>
        </div>
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import tasksListController from "@/components/tasks/tasks.search";
import useTasksStore from "@/store/tasks";
import usePagination from "@/store/pagination";

export default defineComponent({
  name: "TasksSearch",
  setup() {
    const { getLists, init, search, listQuery } = tasksListController();
    const { showListData } = useTasksStore();
    const { paginationStore } = usePagination();
    init();

    return {
      init,
      listQuery,
      getLists,
      search,
      showListData,
      paginationStore,
    };
  },
});
</script>
<style scoped lang="scss">
.active {
  background-color: gray;
}
.pagination-block-list {
  width: 50px;
  height: 50px;
  font-size: 30px;
}
.pagination-block li {
  float: left;
}
</style>