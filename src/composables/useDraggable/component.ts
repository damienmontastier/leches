import { computed, defineComponent, h, reactive, ref } from 'vue'
import type { UseDraggableOptions } from '@vueuse/core'
import { isClient, useStorage } from '@vueuse/core'
import { toValue } from '@vueuse/shared'
import type { Position, RenderableComponent } from '.'
import { useDraggable } from '.'

export interface UseDraggableProps extends UseDraggableOptions, RenderableComponent {
  /**
   * When provided, use `useStorage` to preserve element's position
   */
  storageKey?: string

  /**
   * Storage type
   *
   * @default 'local'
   */
  storageType?: 'local' | 'session'
}

export const UseDraggable = /* #__PURE__ */ defineComponent<UseDraggableProps>({
  name: 'UseDraggable',
  props: [
    'storageKey',
    'storageType',
    'initialValue',
    'exact',
    'preventDefault',
    'stopPropagation',
    'pointerTypes',
    'as',
    'handle',
    'axis',
    'onStart',
    'onMove',
    'onEnd',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const handle = computed(() => props.handle ?? target.value)
    const storageValue = props.storageKey && useStorage(
      props.storageKey,
      toValue(props.initialValue) || { x: 0, y: 0 },
      isClient
        ? props.storageType === 'session'
          ? sessionStorage
          : localStorage
        : undefined,
    )
    const initialValue = storageValue || props.initialValue || { x: 0, y: 0 }
    const onEnd = (position: Position, event: PointerEvent) => {
      props.onEnd?.(position, event)
      if (!storageValue) { return }
      storageValue.value.x = position.x
      storageValue.value.y = position.y
    }

    const data = reactive(useDraggable(target, {
      ...props,
      handle,
      initialValue,
      onEnd,
    }))

    return () => {
      if (slots.default) { return h(props.as || 'div', { ref: target, style: `touch-action:none;${data.style}` }, slots.default(data)) }
    }
  },
})
