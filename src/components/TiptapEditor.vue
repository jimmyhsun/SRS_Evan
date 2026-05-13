<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { ResizableImage } from '../extensions/ResizableImageExtension'

const fileInput = ref<HTMLInputElement | null>(null)
const showTableDialog = ref(false)
const tableRows = ref(3)
const tableCols = ref(3)
const tableWithHeader = ref(true)

const colorPresets = [
  '#000000', '#434343', '#666666', '#999999',
  '#e03131', '#e8590c', '#f08c00', '#2f9e44',
  '#1971c2', '#6741d9', '#c2255c', '#0c8599',
]

const editor = useEditor({
  content: `
    <p>請在此輸入執行細節，支援圖片插入...</p>
  `,
  extensions: [
    StarterKit,
    ResizableImage,
    TextStyle,
    Color,
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
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

function openTableDialog() {
  showTableDialog.value = true
}

function confirmInsertTable() {
  editor.value?.chain().focus().insertTable({
    rows: tableRows.value,
    cols: tableCols.value,
    withHeaderRow: tableWithHeader.value,
  }).run()
  showTableDialog.value = false
}

function cancelTableDialog() {
  showTableDialog.value = false
}

function setColor(color: string) {
  editor.value?.chain().focus().setColor(color).run()
}

function unsetColor() {
  editor.value?.chain().focus().unsetColor().run()
}

function addColumnBefore() {
  editor.value?.chain().focus().addColumnBefore().run()
}

function addColumnAfter() {
  editor.value?.chain().focus().addColumnAfter().run()
}

function deleteColumn() {
  editor.value?.chain().focus().deleteColumn().run()
}

function addRowBefore() {
  editor.value?.chain().focus().addRowBefore().run()
}

function addRowAfter() {
  editor.value?.chain().focus().addRowAfter().run()
}

function deleteRow() {
  editor.value?.chain().focus().deleteRow().run()
}

function mergeCells() {
  editor.value?.chain().focus().mergeCells().run()
}

function splitCell() {
  editor.value?.chain().focus().splitCell().run()
}

function deleteTable() {
  editor.value?.chain().focus().deleteTable().run()
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
  target.value = ''
}

function handleEditorClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.tagName === 'IMG') {
    const img = target as HTMLImageElement
    const pos = editor.value?.view.posAtDOM(img, 0)
    if (pos !== undefined && editor.value) {
      editor.value.commands.setNodeSelection(pos)
    }
  }
}

function resizeImage(size: 'small' | 'medium' | 'large' | 'full') {
  if (!editor.value) return
  const { state } = editor.value
  const { selection } = state
  const node = state.doc.nodeAt(selection.from)

  if (node?.type.name === 'image') {
    const widthMap = { small: 150, medium: 300, large: 450, full: 0 }
    const width = widthMap[size]

    if (width === 0) {
      editor.value.chain().focus().updateAttributes('image', { width: null, height: null }).run()
    } else {
      editor.value.chain().focus().updateAttributes('image', { width, height: null }).run()
    }
  }
}

const imageWidth = ref<string>('')
const imageHeight = ref<string>('')
const imageSelected = ref(false)

function applyImageSize() {
  if (!editor.value) return
  const w = imageWidth.value ? Number(imageWidth.value) : null
  const h = imageHeight.value ? Number(imageHeight.value) : null
  editor.value.chain().focus().updateAttributes('image', { width: w, height: h }).run()
}

function isImageSelected(): boolean {
  if (!editor.value) return false
  const { state } = editor.value
  const node = state.doc.nodeAt(state.selection.from)
  return node?.type.name === 'image'
}

// Watch for selection changes to sync image size inputs
function syncImageInputs() {
  if (!editor.value) return
  const { state } = editor.value
  const node = state.doc.nodeAt(state.selection.from)
  if (node?.type.name === 'image') {
    if (!imageSelected.value) {
      // Only sync when first selecting the image
      imageWidth.value = node.attrs.width ? String(node.attrs.width) : ''
      imageHeight.value = node.attrs.height ? String(node.attrs.height) : ''
    }
    imageSelected.value = true
  } else {
    imageSelected.value = false
  }
}

// Attach selection listener once editor is ready
watch(editor, (ed) => {
  if (ed) {
    ed.on('selectionUpdate', syncImageInputs)
  }
})

function isInTable(): boolean {
  if (!editor.value) return false
  return editor.value.isActive('table')
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

    <!-- Table Insert Dialog -->
    <div v-if="showTableDialog" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50" @click.self="cancelTableDialog">
      <div class="bg-white rounded-lg shadow-xl p-6 w-[300px]">
        <h3 class="text-sm font-semibold mb-4">插入表格</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm text-gray-600">列數（rows）</label>
            <input v-model.number="tableRows" type="number" min="1" max="20" class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center" />
          </div>
          <div class="flex items-center justify-between">
            <label class="text-sm text-gray-600">欄數（cols）</label>
            <input v-model.number="tableCols" type="number" min="1" max="10" class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center" />
          </div>
          <div class="flex items-center justify-between">
            <label class="text-sm text-gray-600">包含表頭</label>
            <input v-model="tableWithHeader" type="checkbox" class="w-4 h-4" />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-5">
          <button @click="cancelTableDialog" class="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">取消</button>
          <button @click="confirmInsertTable" class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">插入</button>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="tiptap-toolbar no-print flex items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50 flex-wrap">
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

      <!-- Color picker -->
      <div class="relative group">
        <button
          class="px-3 py-1 rounded hover:bg-gray-200 text-sm transition-colors cursor-pointer"
          title="文字顏色"
        >
          <span class="font-bold" :style="{ color: editor?.getAttributes('textStyle')?.color || '#000' }">A</span>
          <span class="block h-0.5 w-full rounded" :style="{ background: editor?.getAttributes('textStyle')?.color || '#000' }"></span>
        </button>
        <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:grid grid-cols-4 gap-1 z-20 w-[140px]">
          <button
            v-for="color in colorPresets"
            :key="color"
            @click="setColor(color)"
            class="w-7 h-7 rounded border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
            :style="{ backgroundColor: color }"
            :title="color"
          ></button>
          <button
            @click="unsetColor()"
            class="w-7 h-7 rounded border border-gray-200 cursor-pointer hover:scale-110 transition-transform text-xs flex items-center justify-center col-span-4 mt-1"
            title="移除顏色"
          >
            ✕ 預設
          </button>
        </div>
      </div>

      <button
        @click="openTableDialog"
        class="px-3 py-1 rounded hover:bg-gray-200 text-sm transition-colors cursor-pointer"
        title="插入表格"
      >
        ☷ 表格
      </button>
      <button
        @click="triggerFileUpload"
        class="px-3 py-1 rounded hover:bg-gray-200 text-sm transition-colors cursor-pointer"
        title="上傳圖片"
      >
        🖼 上傳圖片
      </button>

      <!-- Table controls (shown when cursor is inside a table) -->
      <template v-if="isInTable()">
        <span class="mx-2 text-gray-300">|</span>
        <button
          @click="addColumnBefore"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
          title="在左方插入欄"
        >
          ← 插入欄
        </button>
        <button
          @click="addColumnAfter"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
          title="在右方插入欄"
        >
          插入欄 →
        </button>
        <button
          @click="deleteColumn"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs text-red-600 transition-colors cursor-pointer"
          title="刪除欄"
        >
          刪除欄
        </button>
        <span class="mx-1 text-gray-300">|</span>
        <button
          @click="addRowBefore"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
          title="在上方插入列"
        >
          ↑ 插入列
        </button>
        <button
          @click="addRowAfter"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
          title="在下方插入列"
        >
          插入列 ↓
        </button>
        <button
          @click="deleteRow"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs text-red-600 transition-colors cursor-pointer"
          title="刪除列"
        >
          刪除列
        </button>
        <span class="mx-1 text-gray-300">|</span>
        <button
          @click="mergeCells"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
          title="合併儲存格"
        >
          合併
        </button>
        <button
          @click="splitCell"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
          title="分割儲存格"
        >
          分割
        </button>
        <span class="mx-1 text-gray-300">|</span>
        <button
          @click="deleteTable"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs text-red-600 transition-colors cursor-pointer"
          title="刪除表格"
        >
          刪除表格
        </button>
      </template>

      <!-- Image size controls (shown when image is selected) -->
      <template v-if="isImageSelected()">
        <span class="mx-2 text-gray-300">|</span>
        <span class="text-xs text-gray-500 mr-1">寬：</span>
        <input
          v-model="imageWidth"
          type="number"
          min="0"
          placeholder="auto"
          class="w-16 px-1.5 py-0.5 border border-gray-300 rounded text-xs text-center"
          @change="applyImageSize"
          @keyup.enter="applyImageSize"
        />
        <span class="text-xs text-gray-500 mx-1">高：</span>
        <input
          v-model="imageHeight"
          type="number"
          min="0"
          placeholder="auto"
          class="w-16 px-1.5 py-0.5 border border-gray-300 rounded text-xs text-center"
          @change="applyImageSize"
          @keyup.enter="applyImageSize"
        />
        <span class="text-xs text-gray-400 ml-1">px</span>
        <button
          @click="resizeImage('small')"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer ml-2"
        >
          小
        </button>
        <button
          @click="resizeImage('medium')"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
        >
          中
        </button>
        <button
          @click="resizeImage('large')"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
        >
          大
        </button>
        <button
          @click="resizeImage('full')"
          class="px-2 py-1 rounded hover:bg-gray-200 text-xs transition-colors cursor-pointer"
        >
          原始
        </button>
      </template>
    </div>

    <!-- Editor Content -->
    <div @click="handleEditorClick">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>
