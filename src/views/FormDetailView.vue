<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuditStore } from '../stores/auditStore'

const route = useRoute()
const router = useRouter()
const store = useAuditStore()

const formId = computed(() => route.params.id as string)
const form = computed(() => store.getFormById(formId.value))

const showApproveDialog = ref(false)
const showRejectDialog = ref(false)

function goBack() {
  router.push('/')
}

function handleApprove() {
  store.approveForm(formId.value)
  showApproveDialog.value = true
}

function handleReject() {
  store.rejectForm(formId.value)
  showRejectDialog.value = true
}

function closeDialog() {
  showApproveDialog.value = false
  showRejectDialog.value = false
  router.push('/')
}

function handlePrint() {
  window.print()
}

function statusColor(status: string) {
  switch (status) {
    case '待審核': return 'bg-yellow-100 text-yellow-800'
    case '已審核': return 'bg-green-100 text-green-800'
    case '退簽': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 print-page">
    <!-- Header -->
    <header class="bg-white shadow-sm no-print">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          >
            ← 返回
          </button>
          <h1 class="text-xl font-bold text-gray-800">審核表單詳情</h1>
          <span v-if="form" :class="statusColor(form.status)" class="px-2 py-1 rounded text-xs font-medium">
            {{ form.status }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <!-- Approve/Reject buttons for pending forms -->
          <template v-if="form?.status === '待審核'">
            <button
              @click="handleReject"
              class="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
            >
              退簽
            </button>
            <button
              @click="handleApprove"
              class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
            >
              確認審核
            </button>
          </template>
          <!-- PDF download for approved forms -->
          <button
            v-if="form?.status === '已審核'"
            @click="handlePrint"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            下載 PDF
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <div v-if="!form" class="text-center text-gray-500 py-20">
        找不到此表單
      </div>

      <div v-else class="bg-gray-200 py-6 print-area">
        <div class="print-container bg-white max-w-[210mm] mx-auto shadow-lg p-10 rounded">
          <!-- Title -->
          <h1 class="text-xl font-bold text-center mb-2">狗狗集團</h1>
          <h2 class="text-lg font-bold text-center mb-6">109 年度審核</h2>

          <!-- Audit Table -->
          <table class="w-full border-collapse border border-gray-400 text-sm mb-6">
            <tr>
              <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold w-[120px] align-top">指標</td>
              <td class="border border-gray-400 px-4 py-2 font-medium">{{ form.indicator }}</td>
            </tr>
            <tr>
              <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">指標項目</td>
              <td class="border border-gray-400 px-4 py-2">{{ form.indicatorItem }}</td>
            </tr>
            <tr>
              <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">查核期間</td>
              <td class="border border-gray-400 px-4 py-2">{{ form.period }}</td>
            </tr>
            <tr>
              <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">基準說明</td>
              <td class="border border-gray-400 px-4 py-2">
                <div v-for="item in form.criteria" :key="item" class="py-0.5">{{ item }}</div>
              </td>
            </tr>
            <tr>
              <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top">自評等級</td>
              <td class="border border-gray-400 px-4 py-2">{{ form.selfRating }}</td>
            </tr>
            <tr>
              <td class="border border-gray-400 px-4 py-2 bg-green-100 font-semibold align-top" colspan="2">執行說明：</td>
            </tr>
            <tr>
              <td class="border border-gray-400 px-4 py-3" colspan="2">
                <div class="prose-content" v-html="form.editorContent"></div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </main>

    <!-- Approve Dialog -->
    <div v-if="showApproveDialog" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm text-center">
        <div class="text-4xl mb-4">✅</div>
        <h3 class="text-lg font-semibold mb-2">審核完成</h3>
        <p class="text-gray-500 text-sm mb-6">此表單已標記為「已審核」。</p>
        <button
          @click="closeDialog"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          回到 Dashboard
        </button>
      </div>
    </div>

    <!-- Reject Dialog -->
    <div v-if="showRejectDialog" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm text-center">
        <div class="text-4xl mb-4">❌</div>
        <h3 class="text-lg font-semibold mb-2">已退簽</h3>
        <p class="text-gray-500 text-sm mb-6">此表單已標記為「退簽」。</p>
        <button
          @click="closeDialog"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          回到 Dashboard
        </button>
      </div>
    </div>
  </div>
</template>
