<script setup lang="ts">
import Quill, { QuillOptionsStatic, StringMap } from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { onMounted, ref, toRef, watch } from 'vue'

const props = defineProps<{
  /** 选项 */
  options?: QuillOptionsStatic
  /** placeholder */
  placeholder?: string
  /** 只读 */
  readOnly?: boolean
  /** 文本内容 */
  value?: string
  /** 禁用 */
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'blur', quill: Quill): void
  (event: 'focus', quill: Quill): void
  (event: 'update:value', val: string): void
  (event: 'input', val: string): void
  (event: 'change', data: { html: string; text: string; quill: Quill }): void
  (event: 'ready', quill: Quill): void
}>()

const editor = ref<HTMLDivElement>()
const quill = ref<Quill>()

const content = ref('')

onMounted(() => {
  quill.value = new Quill(editor.value!, {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video'],
      ],
    },
    theme: 'snow',
    ...props.options,
    placeholder: props.placeholder,
    readOnly: props.readOnly,
  })

  if (props.value) {
    quill.value.clipboard.dangerouslyPasteHTML(props.value!)
  }

  quill.value.enable(!props.disabled)

  quill.value.on('selection-change', range => {
    if (range) {
      emit('focus', quill.value!)
    } else {
      emit('blur', quill.value!)
    }
  })

  quill.value.on('text-change', (delta, oldDelta, source) => {
    let html = editor.value?.children?.[0]?.innerHTML ?? ''
    if (html === '<p><br></p>') html = ''
    const text = quill.value!.getText()
    content.value = html
    emit('update:value', html)
    emit('input', html)
    emit('change', { html, text, quill: quill.value! })
  })

  emit('ready', quill.value)
})

watch(toRef(props, 'value'), (nv, ov) => {
  if (!quill.value) return
  if (nv == ov || nv == content.value) return
  if (nv) {
    quill.value.clipboard.dangerouslyPasteHTML(nv!)
  } else {
    quill.value.setText('')
  }
})

watch(toRef(props, 'disabled'), d => {
  if (!quill.value) return
  quill.value.enable(!d)
})
</script>

<template>
  <div class="ui-quill-editor">
    <div ref="editor" class="editor"></div>
  </div>
</template>

<style lang="scss">
.ui-quill-editor {
  .editor {
    min-height: 200px;
  }
}
</style>
