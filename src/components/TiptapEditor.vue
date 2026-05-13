<script setup lang="ts">
import { ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

const fileInput = ref<HTMLInputElement | null>(null)

const editor = useEditor({
  content: `
    <p>請在此輸入執行細節，支援圖片插入...</p>
  `,
  extensions: [
    StarterKit,
    Image,
  ],
})

function toggleBold() {
  editor.value?.chain().focus().toggleBold().run()
}

function toggleItalic() {
  editor.value?.chain().focus().toggleItalic().run()
}

function toggleBulletList() {
  editor.value?.chain().focus().toggleBulletList().run()
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (result) {
      editor.value?.chain().focus().setImage({ src: result }).run()
    }
  }
  reader.readAsDataURL(file)

  // Reset input so the same file can be selected again
  target.value = ''
}
</script>

<template>
  <div class="tiptap-editor">
    <!-- Hidden file input for image upload -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Toolbar -->
    <div class="tiptap-toolbar no-print flex items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50">
      <button
        @click="toggleBold"
        :class="{ 'bg-gray-300': editor?.isActive('bold') }"
        class="px-3 py-1 rounded hover:bg-gray-200 font-bold text-sm transition-colors cursor-pointer"
        title="粗體"
      >
        B
      </button>
      <button
        @click="toggleItalic"
        :class="{ 'bg-gray-300': editor?.isActive('italic') }"
        class="px-3 py-1 rounded hover:bg-gray-200 italic text-sm transition-colors cursor-pointer"
        title="斜體"
      >
        I
      </button>
      <button
        @click="toggleBulletList"
        :class="{ 'bg-gray-300': editor?.isActive('bulletList') }"
        class="px-3 py-1 rounded hover:bg-gray-200 text-sm transition-colors cursor-pointer"
        title="項目符號"
      >
        • 列表
      </button>
      <button
        @click="triggerFileUpload"
        class="px-3 py-1 rounded hover:bg-gray-200 text-sm transition-colors cursor-pointer"
        title="上傳圖片"
      >
        🖼 上傳圖片
      </button>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" />
  </div>
</template>
