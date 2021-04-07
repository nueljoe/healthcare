<template>
  <div>
    <div class="mt-8 max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-8">
        <!-- categories select -->
        <div class="col-span-2"> 
          <fieldset>
            <legend class="sr-only">
              Categories
            </legend>
            <div class="bg-white rounded-md -space-y-px">
              <div class="relative border rounded-tl-md rounded-tr-md p-3 flex items-center bg-gray-100">
                <!-- <div class="bg-gray-300 rounded-md p-2">
                  <categories-icon :svgClass="'text-gray-500 h-4 w-4'" />
                </div> -->
                <p class="ml-2 text-md font-medium">Categories management</p>
              </div>

              <!-- course categories -->
              <div 
                class="relative border p-4 flex" 
                :class="[activeView === 'coursesCategories' ? 'bg-blue-100 border-blue-300 z-10' : 'border-gray-200']"
                @click="setActiveView('coursesCategoriesTable', 'course')"
              >
                <div class="flex items-center h-5">
                  <input 
                    id="course-categories" 
                    value="coursesCategoriesTable"
                    v-model="activeView"
                    type="radio" 
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 cursor-pointer border border-gray-300"
                    :checked="activeView === 'coursesCategoriesTable'"
                  />
                </div>
                <label for="settings-option-0" class="ml-3 flex flex-col cursor-pointer">
                  <span class="block text-sm font-medium">
                    Courses
                  </span>
                  <span 
                    class="block text-sm"
                    :class="{'text-blue-400' : activeView === 'coursesCategoriesTable'}"
                  >
                    Click here to manage course categories
                  </span>
                </label>
              </div>

             <!-- product categories -->
              <div 
                class="relative border p-4 flex rounded-bl-md rounded-br-md"  
                @click="setActiveView('productCategoriesTable', 'product')"
                :class="[activeView === 'productCategoriesTable' ? 'bg-blue-100 border-blue-300 z-10' : 'border-gray-200']"
              >
                <div class="flex items-center h-5">
                  <input 
                    id="product-categories" 
                    value="productCategoriesTable"
                    v-model="activeView"
                    type="radio"
                    class="h-4 w-4 text-blue-600 cursor-pointer border border-gray-300"
                    :checked="activeView === 'productCategoriesTable'"
                  />
                </div>

                <!-- product categories -->
                <label for="settings-option-1" class="ml-3 flex flex-col cursor-pointer">
                  <span class="block text-sm font-medium">
                    Products
                  </span>
                  <span 
                    class="block text-sm" 
                    :class="{'text-blue-400' : activeView === 'productCategories'}"
                  >
                    Click here to manage course categories
                  </span>
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <!-- courses and projects category table -->
        <div class="col-span-5">
          <div class="flex justify-between mb-3 items-center">
            <h2 class="text-lg leading-6 font-medium text-gray-900 capitalize pb-0 mb-0">{{ categoryType }} Categories</h2>
            <div class="flex justify-end mb-2">
              <span class="relative z-0 inline-flex shadow-sm">
                <selfcare-button 
                  button-label="Create" 
                  button-class="selfare-button__light"
                  :rounded="false"
                  @click="$modal.show('create-category-modal')"
                />
              </span>
              <span class="relative z-0 inline-flex shadow-sm">
                <selfcare-button 
                  button-label="Export" 
                  button-class="selfare-button__light rounded-none"
                  :rounded="false"
                />
              </span>
            </div>
          </div>
          <keep-alive>
            <transition name="fade" mode="out-in">
              <component :is="activeView" v-bind="{ categoryType: categoryType }"></component>
            </transition>
          </keep-alive>
        </div>
      </div>
    </div>

    <!-- modal to create category -->
    <categories-modal 
      actionType="create" 
      :categoryType="categoryType" 
      modal-name="create-category-modal"
    />
  </div>
</template>

<script>
  import coursesCategoriesTable from '@/components/tables/categories/categoriesTable';
  import ProductCategoriesTable from '@/components/tables/categories/categoriesTable';
  // const CategoriesIcon = () => import('@/components/vectors/categories');
  import CategoriesModal from '@/components/modals/categoriesModal';

  export default {
    data() {
      return {
        activeView: 'coursesCategoriesTable',
        categoryType: 'course'
      }
    },
    components: {
      coursesCategoriesTable,
      ProductCategoriesTable,
      CategoriesModal
    },
    methods: {
      setActiveView(activeView, categoryType) {
        this.activeView = activeView
        this.categoryType = categoryType
      }
    }
  }

</script>