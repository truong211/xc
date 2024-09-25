<template>
  <v-app>
    <v-container>
      <v-menu
          offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
          >
            <v-avatar>
              <img src="../Images/angry.png" alt="Avatar">
            </v-avatar>
          </v-btn>
        </template>

        <v-list dense style="min-width: 300px !important;">
          <v-list-item
            class="d-flex align-center"
          >
            <v-list-item-title class="ml-1">
              Tài khoản
            </v-list-item-title>

          </v-list-item>
          <v-list-item class="d-flex align-center">
            <v-list-item-icon class="mx-0">
              <v-icon size="23">mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="ml-1">Phạm Phương Hùng
              <v-icon style="cursor: pointer;" @click="setActionUpdateUser">mdi-pencil-outline</v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>

      </v-menu>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'PopupMenu',
};
</script>

<style>
.v-list-item-title {
  font-weight: bold;
}
</style>
