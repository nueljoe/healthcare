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
                <!-- <div class="bg-blue-700 rounded-md p-2">
                  <categories-icon :svgClass="'text-white h-4 w-4'" />
                </div> -->
                <p class="ml-2 text-md font-medium">Categories management</p>
              </div>

              <!-- course categories -->
              <div 
                class="relative border p-4 flex" 
                :class="[activeView === 'coursesCategories' ? 'bg-blue-100 border-blue-300 z-10' : 'border-gray-200']"
                @click="activeView = 'coursesCategories'"
              >
                <div class="flex items-center h-5">
                  <input 
                    id="course-categories" 
                    value="coursesCategories"
                    v-model="activeView"
                    type="radio" 
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 cursor-pointer border border-gray-300"
                    :checked="activeView === 'coursesCategories'"
                  />
                </div>
                <label for="settings-option-0" class="ml-3 flex flex-col cursor-pointer">
                  <span class="block text-sm font-medium">
                    Courses
                  </span>
                  <span 
                    class="block text-sm"
                    :class="{'text-blue-400' : activeView === 'coursesCategories'}"
                  >
                    Click here to manage course categories
                  </span>
                </label>
              </div>

             <!-- product categories -->
              <div 
                class="relative border p-4 flex rounded-bl-md rounded-br-md"  
                @click="activeView = 'productCategories'"
                :class="[activeView === 'productCategories' ? 'bg-blue-100 border-blue-300 z-10' : 'border-gray-200']"
              >
                <div class="flex items-center h-5">
                  <input 
                    id="product-categories" 
                    value="productCategories"
                    v-model="activeView"
                    type="radio"
                    class="h-4 w-4 text-blue-600 cursor-pointer border border-gray-300"
                    :checked="activeView === 'productCategories'"
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
          <keep-alive>
            <transition name="fade" mode="out-in">
              <component :is="activeView"></component>
            </transition>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import coursesCategories from '@/components/tables/categories/categories'
  import ProductCategories from '@/components/tables/categories/categories'
   const CategoriesIcon = () => import('@/components/vectors/categories')
  export default {
    data() {
      return {
        activeView: 'coursesCategories'
      }
    },
    components: {
      coursesCategories,
      ProductCategories,
      CategoriesIcon
    }
  }

</script>