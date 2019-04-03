<template>
<el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab" :tab-position="tabPosition" :lazy="true">
  <el-tab-pane
    v-for="item in editableTabs"
    :key="item.name"
    :label="item.title"
    :name="item.name"
  >
  <helloworld></helloworld>
  </el-tab-pane>
</el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        titleName:'tab',
        tabPosition:'left',
        editableTabsValue: '1',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        },],
        tabIndex: 1,
        activeName:'test',
      }
    },
    methods: {
      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: this.titleName,
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }
</script>