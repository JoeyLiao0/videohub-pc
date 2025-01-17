import { ref, computed } from 'vue';
import { mount } from '@vue/test-utils';

describe('Computed Properties', () => {
  it('correctly computes the date', () => {
    const userRegisterTime = ref(1672502400000); // 示例时间戳
    const date = computed(() => {
      const timestamp = userRegisterTime.value;
      return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
    });

    expect(date.value).toBe('2023/1/1'); // 根据时间戳，期望返回的日期
  });

  it('correctly computes the status', () => {
    const userStatus = ref(0); // 示例状态值
    const status = computed(() => {
      const num = userStatus.value;
      if (num == 0) {
        return '正常';
      } else if (num == 1) {
        return '封禁';
      } else {
        return '注销';
      }
    });

    expect(status.value).toBe('正常'); // 期望返回的状态
    userStatus.value = 1; // 修改状态值
    expect(status.value).toBe('封禁'); // 期望返回的状态
    userStatus.value = 2; // 修改状态值
    expect(status.value).toBe('注销'); // 期望返回的状态
  });
});