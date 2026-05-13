import { defineStore } from 'pinia'
import { ref } from 'vue'

export type AuditStatus = '待審核' | '已審核' | '退簽'

export interface AuditForm {
  id: string
  indicator: string       // 指標（上層選的大類）
  indicatorItem: string   // 指標項目
  criteria: string[]      // 基準說明
  period: string          // 查核期間
  selfRating: string      // 自評等級
  editorContent: string   // 執行說明 (HTML)
  status: AuditStatus
  createdAt: string
}

// 指標選項對應的指標項目與基準說明
export const INDICATOR_MAP: Record<string, { item: string; criteria: string[] }> = {
  '環境管理': {
    item: 'C8. 環境污染',
    criteria: ['1.空氣', '2.環境', '3.桌椅', '4.草地', '5.黑板'],
  },
  '安全衛生': {
    item: 'C10. 安全衛生管理',
    criteria: ['1.消防設備', '2.逃生動線', '3.急救箱', '4.安全標示', '5.防護設備'],
  },
  '能源資源': {
    item: 'C3. 能源使用效率',
    criteria: ['1.用電量', '2.用水量', '3.廢棄物回收', '4.碳排放', '5.節能措施'],
  },
}

export const INDICATOR_OPTIONS = Object.keys(INDICATOR_MAP)

export const useAuditStore = defineStore('audit', () => {
  const forms = ref<AuditForm[]>([
    {
      id: '1001',
      indicator: '環境管理',
      indicatorItem: 'C8. 環境污染',
      criteria: ['1.空氣', '2.環境', '3.桌椅', '4.草地', '5.黑板'],
      period: '105年 ～ 112年',
      selfRating: '合格',
      editorContent: '<p>本次環境管理審核結果良好，各項指標均符合標準。</p><p>已完成空氣品質檢測與環境清潔度評估。</p>',
      status: '待審核',
      createdAt: '2026/05/10',
    },
    {
      id: '1002',
      indicator: '安全衛生',
      indicatorItem: 'C10. 安全衛生管理',
      criteria: ['1.消防設備', '2.逃生動線', '3.急救箱', '4.安全標示', '5.防護設備'],
      period: '105年 ～ 112年',
      selfRating: '待改善',
      editorContent: '<p>消防設備檢查發現部分滅火器已過期，需於下月底前更換。</p><ul><li>A棟 3F 滅火器過期</li><li>B棟 1F 逃生指示燈故障</li></ul>',
      status: '待審核',
      createdAt: '2026/05/08',
    },
    {
      id: '1003',
      indicator: '能源資源',
      indicatorItem: 'C3. 能源使用效率',
      criteria: ['1.用電量', '2.用水量', '3.廢棄物回收', '4.碳排放', '5.節能措施'],
      period: '105年 ～ 112年',
      selfRating: '合格',
      editorContent: '<p>本年度用電量較去年下降 8%，節能措施執行良好。</p><p>廢棄物回收率達 92%，超過目標值。</p>',
      status: '已審核',
      createdAt: '2026/04/25',
    },
    {
      id: '1004',
      indicator: '環境管理',
      indicatorItem: 'C8. 環境污染',
      criteria: ['1.空氣', '2.環境', '3.桌椅', '4.草地', '5.黑板'],
      period: '105年 ～ 112年',
      selfRating: '合格',
      editorContent: '<p>環境污染各項指標均在合格範圍內，持續監控中。</p>',
      status: '已審核',
      createdAt: '2026/04/20',
    },
    {
      id: '1005',
      indicator: '安全衛生',
      indicatorItem: 'C10. 安全衛生管理',
      criteria: ['1.消防設備', '2.逃生動線', '3.急救箱', '4.安全標示', '5.防護設備'],
      period: '105年 ～ 112年',
      selfRating: '不合格',
      editorContent: '<p>多項安全設備未通過檢查，需重新提交改善計畫。</p><p>退簽原因：急救箱內容物過期、安全標示缺損嚴重。</p>',
      status: '退簽',
      createdAt: '2026/05/01',
    },
    {
      id: '1006',
      indicator: '能源資源',
      indicatorItem: 'C3. 能源使用效率',
      criteria: ['1.用電量', '2.用水量', '3.廢棄物回收', '4.碳排放', '5.節能措施'],
      period: '105年 ～ 112年',
      selfRating: '待改善',
      editorContent: '<p>用水量超標，需補充節水措施說明後重新送審。</p>',
      status: '退簽',
      createdAt: '2026/04/28',
    },
  ])

  function createForm(indicator: string, editorContent: string, selfRating: string): AuditForm {
    const config = INDICATOR_MAP[indicator]
    const form: AuditForm = {
      id: Date.now().toString(),
      indicator,
      indicatorItem: config.item,
      criteria: [...config.criteria],
      period: '105年 ～ 112年',
      selfRating,
      editorContent,
      status: '待審核',
      createdAt: new Date().toLocaleDateString('zh-TW'),
    }
    forms.value.push(form)
    return form
  }

  function approveForm(id: string) {
    const form = forms.value.find(f => f.id === id)
    if (form) {
      form.status = '已審核'
    }
  }

  function rejectForm(id: string) {
    const form = forms.value.find(f => f.id === id)
    if (form) {
      form.status = '退簽'
    }
  }

  function getFormById(id: string): AuditForm | undefined {
    return forms.value.find(f => f.id === id)
  }

  const pendingForms = () => forms.value.filter(f => f.status === '待審核')
  const approvedForms = () => forms.value.filter(f => f.status === '已審核')
  const rejectedForms = () => forms.value.filter(f => f.status === '退簽')

  return {
    forms,
    createForm,
    approveForm,
    rejectForm,
    getFormById,
    pendingForms,
    approvedForms,
    rejectedForms,
  }
})
