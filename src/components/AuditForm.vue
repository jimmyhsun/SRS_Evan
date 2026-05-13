<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from './TiptapEditor.vue'

// 指標下拉選單選項
const indicatorOptions = [
  'C1. 廢棄物管理',
  'C2. 水資源管理',
  'C3. 能源使用',
  'C4. 噪音管制',
  'C5. 化學品管理',
  'C6. 生態保育',
  'C7. 資源回收',
  'C8. 環境污染',
  'C9. 綠化維護',
  'C10. 安全衛生',
]

const selectedIndicator = ref('C8. 環境污染')
const checkPeriodStart = ref('')
const checkPeriodEnd = ref('')
const selfRating = ref('合格')

const ratingOptions = ['合格', '不合格', '待改善']

const criteria = [
  '1.空氣',
  '2.環境',
  '3.桌椅',
  '4.草地',
  '5.黑板',
]
</script>

<template>
  <div>
    <!-- Title -->
    <h1 class="text-xl font-bold text-center mb-2">狗狗集團</h1>
    <h2 class="text-lg font-bold text-center mb-6">109 年度審核</h2>

    <!-- Audit Table (vertical layout matching PDF) -->
    <table class="w-full border-collapse border border-gray-400 text-sm mb-6">
      <!-- 指標 (header row) -->
      <tr>
        <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold w-[120px] align-top">
          指標
        </td>
        <td class="border border-gray-400 px-4 py-2"></td>
      </tr>

      <!-- 指標項目 -->
      <tr>
        <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">
          指標項目
        </td>
        <td class="border border-gray-400 px-1 py-1">
          <select
            v-model="selectedIndicator"
            class="w-full px-3 py-1.5 border-transparent outline-none bg-transparent focus:bg-blue-50 rounded cursor-pointer transition-colors"
          >
            <option v-for="opt in indicatorOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </td>
      </tr>

      <!-- 查核期間 -->
      <tr>
        <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">
          查核期間
        </td>
        <td class="border border-gray-400 px-1 py-1">
          <div class="flex items-center gap-2 px-2">
            <input
              v-model="checkPeriodStart"
              type="date"
              class="px-2 py-1 border-transparent outline-none bg-transparent focus:bg-blue-50 rounded transition-colors"
            />
            <span>～</span>
            <input
              v-model="checkPeriodEnd"
              type="date"
              class="px-2 py-1 border-transparent outline-none bg-transparent focus:bg-blue-50 rounded transition-colors"
            />
          </div>
        </td>
      </tr>

      <!-- 基準說明 -->
      <tr>
        <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">
          基準說明
        </td>
        <td class="border border-gray-400 px-4 py-2">
          <div v-for="item in criteria" :key="item" class="py-0.5">
            {{ item }}
          </div>
        </td>
      </tr>

      <!-- 自評等級 -->
      <tr>
        <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">
          自評等級
        </td>
        <td class="border border-gray-400 px-1 py-1">
          <select
            v-model="selfRating"
            class="w-full px-3 py-1.5 border-transparent outline-none bg-transparent focus:bg-blue-50 rounded cursor-pointer transition-colors"
          >
            <option v-for="opt in ratingOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </td>
      </tr>

      <!-- 執行說明 -->
      <tr>
        <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top" colspan="2">
          執行說明：
        </td>
      </tr>
      <tr>
        <td class="border border-gray-400 p-0" colspan="2">
          <TiptapEditor />
        </td>
      </tr>
    </table>
  </div>
</template>
