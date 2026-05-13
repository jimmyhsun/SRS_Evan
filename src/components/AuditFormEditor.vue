<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from './TiptapEditor.vue'

const props = defineProps<{
  indicator: string
  indicatorItem: string
  criteria: string[]
}>()

const emit = defineEmits<{
  (e: 'submit', editorContent: string, selfRating: string): void
}>()

const selfRating = ref('合格')
const ratingOptions = ['合格', '不合格', '待改善']
const editorRef = ref<InstanceType<typeof TiptapEditor> | null>(null)

function handleSubmit() {
  const content = editorRef.value?.getContent() || ''
  emit('submit', content, selfRating.value)
}
</script>

<template>
  <div class="bg-gray-200 py-10">
    <div class="print-container bg-white max-w-[210mm] mx-auto shadow-lg p-10 rounded relative">
      <!-- Title -->
      <h1 class="text-xl font-bold text-center mb-2">狗狗集團</h1>
      <h2 class="text-lg font-bold text-center mb-6">109 年度審核</h2>

      <!-- Audit Table -->
      <table class="w-full border-collapse border border-gray-400 text-sm mb-6">
        <!-- 指標 -->
        <tr>
          <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold w-[120px] align-top">指標</td>
          <td class="border border-gray-400 px-4 py-2 font-medium">{{ props.indicator }}</td>
        </tr>

        <!-- 指標項目 -->
        <tr>
          <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">指標項目</td>
          <td class="border border-gray-400 px-4 py-2">{{ props.indicatorItem }}</td>
        </tr>

        <!-- 查核期間 -->
        <tr>
          <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">查核期間</td>
          <td class="border border-gray-400 px-4 py-2">105年 ～ 112年</td>
        </tr>

        <!-- 基準說明 -->
        <tr>
          <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">基準說明</td>
          <td class="border border-gray-400 px-4 py-2">
            <div v-for="item in props.criteria" :key="item" class="py-0.5">{{ item }}</div>
          </td>
        </tr>

        <!-- 自評等級 -->
        <tr>
          <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">自評等級</td>
          <td class="border border-gray-400 px-1 py-1">
            <select
              v-model="selfRating"
              class="w-full px-3 py-1.5 border-transparent outline-none bg-transparent focus:bg-blue-50 rounded cursor-pointer transition-colors"
            >
              <option v-for="opt in ratingOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </td>
        </tr>

        <!-- 執行說明 -->
        <tr>
          <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top" colspan="2">執行說明：</td>
        </tr>
        <tr class="editor-row">
          <td class="border border-gray-400 p-0" colspan="2">
            <TiptapEditor ref="editorRef" />
          </td>
        </tr>
      </table>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          @click="handleSubmit"
          class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow"
        >
          送出表單
        </button>
      </div>
    </div>
  </div>
</template>
