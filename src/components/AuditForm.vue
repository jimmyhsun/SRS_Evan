<script setup lang="ts">
import { reactive, ref } from 'vue'
import TiptapEditor from './TiptapEditor.vue'

// 指標 - 自填文字
const indicatorLabel = ref('')

// 指標項目 - 下拉選單
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

// 基準說明 - 可動態增減的列表
const criteria = reactive(['1.空氣', '2.環境', '3.桌椅', '4.草地', '5.黑板'])

function handleCriteriaKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    // 在下方插入新的一行
    criteria.splice(index + 1, 0, '')
    // 等 DOM 更新後 focus 到新的 input
    setTimeout(() => {
      const inputs = document.querySelectorAll('.criteria-input')
      const nextInput = inputs[index + 1] as HTMLTextAreaElement
      nextInput?.focus()
    }, 0)
  } else if (event.key === 'Backspace' && criteria[index] === '' && criteria.length > 1) {
    event.preventDefault()
    // 刪除空白行，focus 到上一行
    criteria.splice(index, 1)
    setTimeout(() => {
      const inputs = document.querySelectorAll('.criteria-input')
      const prevInput = inputs[Math.max(0, index - 1)] as HTMLTextAreaElement
      prevInput?.focus()
    }, 0)
  }
}

function autoResize(event: Event) {
  const el = event.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
</script>

<template>
  <div>
    <!-- Title -->
    <h1 class="text-xl font-bold text-center mb-2">狗狗集團</h1>
    <h2 class="text-lg font-bold text-center mb-6">109 年度審核</h2>

    <!-- Audit Table (vertical layout matching PDF) -->
    <table class="w-full border-collapse border border-gray-400 text-sm mb-6">
      <!-- 指標 (自填文字) -->
      <tr>
        <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold w-[120px] align-top">
          指標
        </td>
        <td class="border border-gray-400 px-1 py-1">
          <input
            v-model="indicatorLabel"
            type="text"
            class="w-full px-3 py-1.5 border-transparent outline-none bg-transparent focus:bg-blue-50 rounded transition-colors"
            placeholder="請輸入指標名稱"
          />
        </td>
      </tr>

      <!-- 指標項目 (下拉選單) -->
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

      <!-- 基準說明 (可動態增減) -->
      <tr>
        <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">
          基準說明
        </td>
        <td class="border border-gray-400 px-2 py-1">
          <div v-for="(_item, index) in criteria" :key="index" class="py-0.5">
            <textarea
              v-model="criteria[index]"
              rows="1"
              class="criteria-input w-full px-2 py-0.5 border-transparent outline-none bg-transparent focus:bg-blue-50 rounded transition-colors resize-none overflow-hidden"
              @keydown="handleCriteriaKeydown($event, index)"
              @input="autoResize($event)"
            ></textarea>
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
      <tr class="editor-row">
        <td class="border border-gray-400 p-0" colspan="2">
          <TiptapEditor />
        </td>
      </tr>
    </table>
  </div>
</template>
