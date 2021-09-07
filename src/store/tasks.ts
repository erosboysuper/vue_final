import { Ref, ref } from 'vue'
import {
    TasksGetFromDatabaseInfo,
    TasksShowData,
    ListItem
} from '@/models/tasks.model'

import { listItemsCount } from './global'
import usePagination from './pagination'

const { setPagination } = usePagination();

const tasksList: Ref<TasksShowData> = ref([])
const showListDataBuffer: Ref<ListItem[]> = ref([]);
const showListData: Ref<ListItem[]> = ref([]);

export default function useTasksStore() {
    const setTasksList = (datas: TasksGetFromDatabaseInfo | null, pageInfo: number, query: string, flag: boolean) => {
        let buffer: ListItem[] = [];

        if (datas) {
            if (flag) {
                tasksList.value = []
                if (pageInfo === 0) pageInfo = 1
            }
            datas.tasks.map((data, index) => {
                buffer.push(data)
                if ((index + 1) % listItemsCount === 0 || index + 1 === datas.tasks.length) {
                    if ((Object.keys(tasksList.value).filter(key => key === pageInfo.toString())).length === 0) {
                        tasksList.value[pageInfo] = buffer
                    } else if ((Object.keys(tasksList.value).filter(key => key === (pageInfo + 1).toString())).length === 0) {
                        tasksList.value[pageInfo + 1] = buffer
                    }
                    buffer = [];
                }
                return true;
            })
        }

        showListDataBuffer.value = tasksList.value[pageInfo];
        showListData.value = [];

        showListDataBuffer.value.map((data) => {
            const currentTime = new Date();
            const oldTime = new Date(data.addedTime);
            let addedTime = '';
            if (currentTime.getFullYear() - oldTime.getFullYear() > 0) {
                addedTime = (currentTime.getFullYear() - oldTime.getFullYear()) + 'years ago';
            } else if (currentTime.getMonth() - oldTime.getMonth() > 0) {
                addedTime = (currentTime.getMonth() - oldTime.getMonth()) + 'months ago';
            } else if (currentTime.getDate() - oldTime.getDate() > 0) {
                addedTime = (currentTime.getDate() - oldTime.getDate()) + 'days ago';
            } else if (currentTime.getHours() - oldTime.getHours() > 0) {
                addedTime = (currentTime.getHours() - oldTime.getHours()) + 'hours ago';
            } else {
                addedTime = (currentTime.getMinutes() - oldTime.getMinutes()) + 'mins ago';
            }
            showListData.value.push({ ...data, addedTime })
        })

        setPagination(pageInfo, query)
    }

    const getLists = () => {
        return tasksList.value;
    }
    const reset = () => {
        showListDataBuffer.value = [];
        tasksList.value = [];
        showListData.value = [];
    }

    return {
        setTasksList,
        showListData,
        getLists,
        reset,
    }
}
