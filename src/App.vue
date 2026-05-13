<script setup lang="ts">
import AuditForm from './components/AuditForm.vue'

function handlePrint() {
  window.print()
}
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
      class="print-container bg-white max-w-[210mm] mx-auto shadow-lg p-10 rounded"
    >
      <AuditForm />
    </div>
  </div>
</template>
