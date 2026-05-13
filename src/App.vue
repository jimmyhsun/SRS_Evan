<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AuditForm from './components/AuditForm.vue'

const PAGE_HEIGHT_MM = 277
const MM_TO_PX = 3.7795275591

const contentRef = ref<HTMLElement | null>(null)
const pageBreakLines = ref<number[]>([])
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

function calculatePageBreaks() {
  if (!contentRef.value) return
  const contentHeight = contentRef.value.scrollHeight
  const pageHeightPx = PAGE_HEIGHT_MM * MM_TO_PX
  const breaks: number[] = []
  let currentPos = pageHeightPx
  while (currentPos < contentHeight) {
    breaks.push(currentPos)
    currentPos += pageHeightPx
  }
  pageBreakLines.value = breaks
}

function handlePrint() {
  window.print()
}

onMounted(() => {
  nextTick(() => {
    if (contentRef.value) {
      calculatePageBreaks()
      resizeObserver = new ResizeObserver(() => calculatePageBreaks())
      resizeObserver.observe(contentRef.value)
      mutationObserver = new MutationObserver(() => {
        nextTick(() => calculatePageBreaks())
      })
      mutationObserver.observe(contentRef.value, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })
    }
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
})
</script>

<template>
  <div class="min-h-screen bg-gray-200 py-10 relative">
    <!-- Download PDF Button -->
    <div class="no-print fixed top-4 right-4 z-50">
      <button
        @click="handlePrint"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md cursor-pointer transition-colors"
      >
        下載 PDF
      </button>
    </div>

    <!-- A4 Paper -->
    <div
      ref="contentRef"
      class="print-container bg-white max-w-[210mm] mx-auto shadow-lg p-10 rounded relative"
    >
      <!-- Page break indicators -->
      <div
        v-for="(pos, index) in pageBreakLines"
        :key="index"
        class="page-break-line no-print"
        :style="{ top: pos + 'px' }"
      >
        <span class="page-break-label">第 {{ index + 2 }} 頁</span>
      </div>

      <AuditForm />
    </div>
  </div>
</template>
