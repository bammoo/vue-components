/**
 * from https://github.com/krystalcampioni/vue-number-input-spinner
 */
<script>
export default {
  name: 'number-input-spinner',
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      default: 0,
      type: Number
    },
    max: {
      default: 10,
      type: Number
    },
    useMin: {
      default: true,
      type: Boolean
    },
    useMax: {
      default: false,
      type: Boolean
    },
    step: {
      default: 1,
      type: Number
    },
    height: {
      default: '26px',
      type: String
    },
    inputFontSize: {
      default: '14px',
      type: String
    },
    buttonFontSize: {
      default: '20px',
      type: String
    },
    integerOnly: {
      default: true,
      type: Boolean
    },
    wideInputTheme: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    inputStyle() {
      return {
        height: this.height,
        'font-size': this.inputFontSize
      }
    },
    buttonStyle() {
      return {
        height: this.height,
        'line-height': (parseInt(this.height) - 4) + 'px',
        'font-size': this.buttonFontSize
      }
    }
  },
  methods: {
    changeToNumber(val) {
      if(this.useMin && val <= this.min ) { 
        val = parseInt(this.min)
      }
      if(this.useMax && val >= this.max ) { 
        val = parseInt(this.max)
      }
      this.$emit('input', Number(val) )
      console.log('changeToNumber', val)
    },
    increaseNumber() { 
      this.changeToNumber(this.value + this.step)
    },
    decreaseNumber() { 
      this.changeToNumber(this.value - this.step)
    },
    isInteger(evt) {
      evt = (evt) ? evt : window.event;
      let key = evt.keyCode || evt.which;
      key = String.fromCharCode( key );
      const regex = /[0-9]/;
      if( !regex.test(key) ) {
        evt.returnValue = false;
        if(evt.preventDefault) evt.preventDefault();
      }
    },
    isNumber(evt) {
       evt = (evt) ? evt : window.event;
       var charCode = (evt.which) ? evt.which : evt.keyCode;
       if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
         evt.preventDefault();
       }
       else {
         return true;
       }
     },
     validateInput(evt) {
      if ( this.integerOnly === true) {
        this.isInteger(evt);
      }
      else {
        this.isNumber(evt);
      }
    },
    handleInput(event) {
      const val = event.target.value
      this.changeToNumber(val)
    }
  }
};
</script>

<template>
<div class="vnis" :class='{wideInputTheme}'>
  <template v-if='wideInputTheme'>
    <div class='vnis__button-wrap'>
      <button 
        class="vnis__button"
        @click.prevent="decreaseNumber" 
        :style="buttonStyle">-</button>
      <button 
        class="vnis__button"
        @click.prevent="increaseNumber" 
        :style="buttonStyle">+</button>
    </div>
    <input
      type="number"
      v-bind:value="value"
      @keypress="validateInput"
      @change="handleInput"
      class="vnis__input"
      :min="min"
      :max="max"
      :style="inputStyle"
    />
  </template>
  <template v-else>
    <button 
      class="vnis__button"
      @click.prevent="decreaseNumber" 
      :style="buttonStyle">-</button>
    <input
      type="number"
      v-bind:value="value"
      @keypress="validateInput"
      @change="handleInput"
      class="vnis__input"
      :min="min"
      :max="max"
      :style="inputStyle"
    />
    <button 
      class="vnis__button"
      @click.prevent="increaseNumber" 
      :style="buttonStyle">+</button>
  </template>
</div>
</template>


<style scoped>
.vnis {
  display: flex;
}
.vnis.wideInputTheme {
  display: block;
}
.vnis *,
.vnis *::after,
.vnis *::before {
  box-sizing: border-box;
}
.wideInputTheme .vnis__input {
  width: 100%;
}
.wideInputTheme .vnis__button-wrap {
  display: flex;
}
.wideInputTheme .vnis__button {
  height: 20px;
  line-height: 18px;
  font-size: 18px;
  width: 50%;
}
.vnis__input,
.vnis__button {
  outline: none;
  margin: 0;
  height: 26px;
}
.vnis__input {
  -webkit-appearance: none;
  border: 1px solid #ebebeb;
  text-align: center;
  width: calc(100% - 52px);
}
.vnis__input::-webkit-outer-spin-button, 
.vnis__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.vnis__button {
  -webkit-appearance: none;
  transition: background .5s ease;
  background: #eee;
  border: 0;
  color: #333;
  cursor: pointer;
  width: 26px;
}
.vnis__button:hover {
  background: #ddd;
  color: #222;
}
</style>
