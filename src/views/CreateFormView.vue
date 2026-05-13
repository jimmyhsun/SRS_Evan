<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuditStore, INDICATOR_OPTIONS, INDICATOR_MAP } from '../stores/auditStore'
import AuditFormEditor from '../components/AuditFormEditor.vue'

const router = useRouter()
const store = useAuditStore()

const step = ref<1 | 2>(1)
const selectedIndicator = ref('')

const indicatorConfig = computed(() => {
  if (!selectedIndicator.value) return null
  return INDICATOR_MAP[selectedIndicator.value]
})

function goToStep2() {
  if (selectedIndicator.value) {
    step.value = 2
  }
}

function goBack() {
  if (step.value === 2) {
    step.value = 1
  } else {
    router.push('/')
  }
}

const showDialog = ref(false)

function handleSubmit(editorContent: string, selfRating: string) {
  store.createForm(selectedIndicator.value, editorContent, selfRating)
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          >
            ← 返回
          </button>
          <h1 class="text-xl font-bold text-gray-800">建立審核表單</h1>
        </div>
        <div class="text-sm text-gray-500">
          步驟 {{ step }} / 2
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <!-- Step 1: Select Indicator -->
      <div v-if="step === 1" class="max-w-md mx-auto">
        <div class="bg-white rounded-lg shadow p-8">
          <h2 class="text-lg font-semibold mb-6">請選擇指標類別</h2>
          <div class="space-y-3">
            <label
              v-for="opt in INDICATOR_OPTIONS"
              :key="opt"
              class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
              :class="selectedIndicator === opt ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'"
            >
              <input
                v-model="selectedIndicator"
                type="radio"
                :value="opt"
                class="w-4 h-4 text-blue-600"
              />
              <span class="font-medium">{{ opt }}</span>
            </label>
          </div>
          <button
            @click="goToStep2"
            :disabled="!selectedIndicator"
            class="mt-6 w-full py-2.5 rounded-lg font-medium transition-colors cursor-pointer"
            :class="selectedIndicator ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
          >
            下一步
          </button>
        </div>
      </div>

      <!-- Step 2: Fill Form -->
      <div v-if="step === 2 && indicatorConfig">
        <AuditFormEditor
          :indicator="selectedIndicator"
          :indicator-item="indicatorConfig.item"
          :criteria="indicatorConfig.criteria"
          @submit="handleSubmit"
        />
      </div>
    </main>

    <!-- Success Dialog -->
    <div v-if="showDialog" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm text-center">
        <div class="text-4xl mb-4">✅</div>
        <h3 class="text-lg font-semibold mb-2">表單已送出</h3>
        <p class="text-gray-500 text-sm mb-6">您的審核表單已成功建立，目前狀態為「待審核」。</p>
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
