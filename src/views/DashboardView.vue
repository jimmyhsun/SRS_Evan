<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuditStore } from '../stores/auditStore'
import type { AuditForm } from '../stores/auditStore'

const router = useRouter()
const store = useAuditStore()

const pending = computed(() => store.pendingForms())
const approved = computed(() => store.approvedForms())
const rejected = computed(() => store.rejectedForms())

function goCreate() {
  router.push('/create')
}

function viewForm(form: AuditForm) {
  router.push(`/form/${form.id}`)
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
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800">狗狗集團 審核管理系統</h1>
        <button
          @click="goCreate"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow cursor-pointer transition-colors"
        >
          + 建立表單
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-5">
          <div class="text-sm text-gray-500">待審核</div>
          <div class="text-2xl font-bold text-yellow-600 mt-1">{{ pending.length }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-5">
          <div class="text-sm text-gray-500">已審核</div>
          <div class="text-2xl font-bold text-green-600 mt-1">{{ approved.length }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-5">
          <div class="text-sm text-gray-500">退簽</div>
          <div class="text-2xl font-bold text-red-600 mt-1">{{ rejected.length }}</div>
        </div>
      </div>

      <!-- Pending Section -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-3">待審核</h2>
        <div v-if="pending.length === 0" class="bg-white rounded-lg shadow p-6 text-center text-gray-400">
          目前沒有待審核的表單
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="form in pending"
            :key="form.id"
            class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div>
              <div class="font-medium text-gray-800">{{ form.indicator }} - {{ form.indicatorItem }}</div>
              <div class="text-sm text-gray-500 mt-0.5">建立日期：{{ form.createdAt }} ｜ 查核期間：{{ form.period }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span :class="statusColor(form.status)" class="px-2 py-1 rounded text-xs font-medium">{{ form.status }}</span>
              <button
                @click="viewForm(form)"
                class="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer transition-colors"
              >
                查看
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Approved Section -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-3">已審核</h2>
        <div v-if="approved.length === 0" class="bg-white rounded-lg shadow p-6 text-center text-gray-400">
          目前沒有已審核的表單
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="form in approved"
            :key="form.id"
            class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div>
              <div class="font-medium text-gray-800">{{ form.indicator }} - {{ form.indicatorItem }}</div>
              <div class="text-sm text-gray-500 mt-0.5">建立日期：{{ form.createdAt }} ｜ 查核期間：{{ form.period }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span :class="statusColor(form.status)" class="px-2 py-1 rounded text-xs font-medium">{{ form.status }}</span>
              <button
                @click="viewForm(form)"
                class="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 cursor-pointer transition-colors"
              >
                查看 / 下載 PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Rejected Section -->
      <section>
        <h2 class="text-lg font-semibold text-gray-700 mb-3">退簽</h2>
        <div v-if="rejected.length === 0" class="bg-white rounded-lg shadow p-6 text-center text-gray-400">
          目前沒有退簽的表單
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="form in rejected"
            :key="form.id"
            class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div>
              <div class="font-medium text-gray-800">{{ form.indicator }} - {{ form.indicatorItem }}</div>
              <div class="text-sm text-gray-500 mt-0.5">建立日期：{{ form.createdAt }} ｜ 查核期間：{{ form.period }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span :class="statusColor(form.status)" class="px-2 py-1 rounded text-xs font-medium">{{ form.status }}</span>
              <button
                @click="viewForm(form)"
                class="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 cursor-pointer transition-colors"
              >
                查看
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
