<template>
  <div>
    <div style="color:#F56C6C;padding:20px 0px;">该页面，仅仅admin身份可以访问，切换到editor身份后，将无法访问</div>
    <div style="margin-bottom:15px;">
      {{ $t('permission.roles') }}： {{ roles }}
    </div>
    {{ $t('permission.switchRoles') }}：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'SwitchRoles'
})
export default class extends Vue {
  get roles() {
    return UserModule.roles
  }

  get switchRoles() {
    return this.roles[0]
  }

  set switchRoles(value) {
    UserModule.ChangeRoles(value).then(() => {
      this.$emit('change')
    })
  }
}
</script>
