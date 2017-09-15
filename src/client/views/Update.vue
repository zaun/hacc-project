<template lang="pug">
#update
  div(v-for="file in files")
    .columns
      .column.is-4 {{file.title}}
      .column.is-4
        input(type="file", :disabled="working", @change="updateFile($event, file)")
      .column.is-4 {{ isValid(file) }}
    .columns
      .column.is-1
      .column.is-7 {{ file.notes }}
  div.buttons
    .columns
      .column
        button(:disabled="!isAllValid() || working", @click="sendToServer()") Save
</template>

<script>
import _ from 'lodash';

var decodeBase64 = function (s) {
  var e = {};
  var i;
  var b = 0;
  var c;
  var x;
  var l = 0;
  var a;
  var r = '';
  var w = String.fromCharCode;
  var L = s.length;
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (i = 0; i < 64; i++) {
    e[A.charAt(i)] = i;
  }
  for (x = 0; x < L; x++) {
    c = e[s.charAt(x)];
    b = (b << 6) + c;
    l += 6;
    while (l >= 8) {
      ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a));
    }
  }
  return r;
};

var csvToArray = function (text) {
  let p = '';
  let row = [''];
  let ret = [row];
  let i = 0;
  let r = 0;
  let s = !0;
  let l;
  for (l in text) {
    l = text[l];
    if (l === '"') {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if (l === ',' && s) {
      l = row[++i] = '';
    } else if (l === '\n' && s) {
      if (p === '\r') {
        row[i] = row[i].slice(0, -1);
      }
      row = ret[++r] = [l = ''];
      i = 0;
    } else {
      row[i] += l;
    }
    p = l;
  }
  return ret;
};

export default {
  name: 'update',

  components: { },

  data () {
    return {
      working: false,
      files: {
        chemicalList: {
          name: 'chemicalList',
          title: 'CHEMICAL LIST',
          notes: '',
          check: {
            row: 3,
            col: 1,
            value: 'Chemical Name'
          },
          data: ''
        },
        summaryA: {
          name: 'summaryA',
          title: 'SUMMARY A.  ENVIRONMENTAL ACTION LEVELS (EALs)',
          notes: 'Groundwater IS Current or Potential Source of Drinking Water',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE A.  ENVIRONMENTAL ACTION LEVELS (EALs)'
          },
          data: ''
        },
        summaryB: {
          name: 'summaryB',
          title: 'SUMMARY B.  ENVIRONMENTAL ACTION LEVELS (EALs)',
          notes: 'Groundwater IS NOT Current or Potential Source of Drinking Water',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE B.  ENVIRONMENTAL ACTION LEVELS (EALs)'
          },
          data: ''
        },
        summaryC: {
          name: 'summaryC',
          title: 'SUMMARY C.  ENVIRONMENTAL ACTION LEVELS (EALs)',
          notes: 'Indoor Air and Soil Vapor (Vapor Intrusion Hazards)',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE C.  ENVIRONMENTAL ACTION LEVELS (EALs)'
          },
          data: ''
        },
        summaryD: {
          name: 'summaryD',
          title: 'SUMMARY D.  ENVIRONMENTAL ACTION LEVELS (EALs)',
          notes: 'Surface Water Bodies',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D.  ENVIRONMENTAL ACTION LEVELS (EALs)'
          },
          data: ''
        },
        tableA1: {
          name: 'tableA1',
          title: 'TABLE A-1.  SOIL ACTION LEVELS',
          notes: 'Potentially impacted groundwater IS a current or potential drinking water resource; Surface water body IS NOT located within 150m of release site',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE A-1.  SOIL ACTION LEVELS'
          },
          data: ''
        },
        tableA2: {
          name: 'tableA2',
          title: 'TABLE A-2.  SOIL ACTION LEVELS',
          notes: 'Potentially impacted groundwater IS a current or potential drinking water resource; Surface water body IS located within 150m of release site',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE A-2.  SOIL ACTION LEVELS'
          },
          data: ''
        },
        tableB1: {
          name: 'tableB1',
          title: 'TABLE B-1.  SOIL ACTION LEVELS',
          notes: 'Potentially impacted groundwater IS NOT a current or potential drinking water resource; Surface water body IS NOT located within 150m of release site',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE B-1.  SOIL ACTION LEVELS'
          },
          data: ''
        },
        tableB2: {
          name: 'tableB2',
          title: 'TABLE B-2.  SOIL ACTION LEVELS',
          notes: 'Potentially impacted groundwater IS NOT a current or potential drinking water resource; Surface water body IS located within 150m of release site',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE B-2.  SOIL ACTION LEVELS'
          },
          data: ''
        },
        tableC1a: {
          name: 'tableC1a',
          title: 'TABLE C-1a. GROUNDWATER ACTION LEVELS',
          notes: 'FOR EVALUATION OF POTENTIAL VAPOR INTRUSION HAZARDS (volatile chemicals only)',
          check: {
            row: 0,
            col: 1,
            value: 'TABLE C-1a. GROUNDWATER ACTION LEVELS'
          },
          data: ''
        },
        tableC1b: {
          name: 'tableC1b',
          title: 'TABLE C-1b. SOIL ACTION LEVELS',
          notes: 'FOR EVALUATION OF POTENTIAL VAPOR INTRUSION HAZARDS (volatile chemicals only) (Use with Soil Gas Action Levels for sites with significant VOC releases)',
          check: {
            row: 0,
            col: 1,
            value: 'TABLE C-1b. SOIL ACTION LEVELS'
          },
          data: ''
        },
        tableC2: {
          name: 'tableC2',
          title: 'TABLE C-2. SHALLOW SOIL VAPOR ACTION LEVELS',
          notes: 'FOR EVALUATION OF POTENTIAL VAPOR INTRUSION HAZARDS (volatile chemicals only)',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE C-2. 1SHALLOW SOIL VAPOR ACTION LEVELS'
          },
          data: ''
        },
        tableC3: {
          name: 'tableC3',
          title: 'TABLE C-3. INDOOR AIR ACTION LEVELS',
          notes: '(volatile chemicals only)',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE C-3. INDOOR AIR ACTION LEVELS'
          },
          data: ''
        },
        tableD1a: {
          name: 'tableD1a',
          title: 'TABLE D-1a. GROUNDWATER ACTION LEVELS',
          notes: '(Groundwater IS a current or potential drinking water resource) (Surface water body IS located within 150 meters of release site)',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-1a. GROUNDWATER ACTION LEVELS'
          },
          data: ''
        },
        tableD1b: {
          name: 'tableD1b',
          title: 'TABLE D-1b. GROUNDWATER ACTION LEVELS',
          notes: '(Groundwater IS a current or potential drinking water resource) (Surface water body IS NOT located within 150m of release site)',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-1b. GROUNDWATER ACTION LEVELS'
          },
          data: ''
        },
        tableD1c: {
          name: 'tableD1c',
          title: 'TABLE D-1c. GROUNDWATER ACTION LEVELS',
          notes: '(Groundwater IS NOT a current or potential drinking water resource) (Surface water body IS located within 150m of release site)',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-1c. GROUNDWATER ACTION LEVELS'
          },
          data: ''
        },
        tableD1d: {
          name: 'tableD1d',
          title: 'TABLE D-1d. GROUNDWATER ACTION LEVELS',
          notes: '(Groundwater IS NOT a current or potential drinking water resource) (Surface water body IS NOT located within 150m of release site)',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-1d. GROUNDWATER ACTION LEVELS'
          },
          data: ''
        },
        tableD2a: {
          name: 'tableD2a',
          title: 'TABLE D-2a. SURFACE WATER ACTION LEVELS',
          notes: 'Fresh Water Habitats',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-2a. SURFACE WATER ACTION LEVELS'
          },
          data: ''
        },
        tableD2b: {
          name: 'tableD2b',
          title: 'TABLE D-2b. SURFACE WATER ACTION LEVELS',
          notes: 'Marine Habitats',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-2b. SURFACE WATER ACTION LEVELS'
          },
          data: ''
        },
        tableD2c: {
          name: 'tableD2c',
          title: 'TABLE D-2c. SURFACE WATER ACTION LEVELS',
          notes: 'Estuary Habitats',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-2c. SURFACE WATER ACTION LEVELS'
          },
          data: ''
        },
        tableD3a: {
          name: 'tableD3a',
          title: 'TABLE D-3a. FINAL DRINKING WATER ACTION LEVELS FOR HUMAN TOXICITY',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-3a. FINAL DRINKING WATER ACTION LEVELS FOR HUMAN TOXICITY'
          },
          data: ''
        },
        tableD3b: {
          name: 'tableD3b',
          title: 'TABLE D-3b. RISK-BASED ACTION LEVELS FOR TAPWATER',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-3b. RISK-BASED ACTION LEVELS FOR TAPWATER'
          },
          data: ''
        },
        tableD4a: {
          name: 'tableD4a',
          title: 'TABLE D-4a.  SUMMARY OF AQUATIC HABITAT GOALS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-4a.  SUMMARY OF AQUATIC HABITAT GOALS'
          },
          data: ''
        },
        tableD4b: {
          name: 'tableD4b',
          title: 'TABLE D-4b. SUMMARY OF SELECTED CHRONIC AQUATIC HABITAT GOALS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-4b. SUMMARY OF SELECTED CHRONIC AQUATIC HABITAT GOALS'
          },
          data: ''
        },
        tableD4c: {
          name: 'tableD4c',
          title: 'TABLE D-4c. SUMMARY OF SELECTED ACUTE AQUATIC HABITAT GOALS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-4c. SUMMARY OF SELECTED ACUTE AQUATIC HABITAT GOALS'
          },
          data: ''
        },
        tableD4d: {
          name: 'tableD4d',
          title: 'TABLE D-4d. SUMMARY OF HAWAI\'I CHRONIC AND ACUTE SURFACE WATER (AQUATIC HABITAT) STANDARDS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-4d. SUMMARY OF HAWAI\'I CHRONIC AND ACUTE'
          },
          data: ''
        },
        tableD4e: {
          name: 'tableD4e',
          title: 'TABLE D-4e. SUMMARY OF USEPA AND OTHER PUBLISHED AQUATIC HABITAT GOALS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-4e. SUMMARY OF USEPA AND OTHER PUBLISHED AQUATIC HABITAT GOALS'
          },
          data: ''
        },
        tableD4f: {
          name: 'tableD4f',
          title: 'TABLE D-4f. SURFACE WATER QUALITY STANDARDS FOR BIOACCUMULATION',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-4f. SURFACE WATER QUALITY STANDARDS FOR BIOACCUMULATION'
          },
          data: ''
        },
        tableD5: {
          name: 'tableD5',
          title: 'TABLE D-5. CALIFORNIA AGRICULTURAL WATER QUALITY GOALS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE D-5. CALIFORNIA AGRICULTURAL'
          },
          data: ''
        },
        tableE: {
          name: 'tableE',
          title: 'TABLE E. SOIL ACTION LEVELS FOR LEACHING CONCERNS',
          notes: '',
          check: {
            row: 0,
            col: 2,
            value: 'TABLE E. SOIL ACTION LEVELS FOR LEACHING CONCERNS'
          },
          data: ''
        },
        tableF1: {
          name: 'tableF1',
          title: 'TABLE F-1. CRITERIA FOR ASSIGNMENT OF SOIL GROSS CONTAMINATION ACTION LEVELS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE F-1. CRITERIA FOR ASSIGNMENT'
          },
          data: ''
        },
        tableF2: {
          name: 'tableF2',
          title: 'TABLE F-2. GROSS CONTAMINATION ACTION LEVELS FOR EXPOSED OR POTENTIALLY EXPOSED SOIL',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE F-2. GROSS CONTAMINATION ACTION LEVELS FOR 1EXPOSED OR POTENTIALLY EXPOSED SOIL'
          },
          data: ''
        },
        tableF3: {
          name: 'tableF3',
          title: 'TABLE F-3. GROSS CONTAMINATION ACTION LEVELS FOR DEEP OR OTHERWISE ISOLATED SOILS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE F-3. GROSS CONTAMINATION ACTION LEVELS FOR 1DEEP OR OTHERWISE ISOLATED SOILS'
          },
          data: ''
        },
        tableG1: {
          name: 'tableG1',
          title: 'TABLE G-1. GROUNDWATER GROSS CONTAMINATION ACTION LEVELS',
          notes: 'groundwater IS a current or potential source of drinking water',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE G-1. GROUNDWATER GROSS CONTAMINATION ACTION LEVELS'
          },
          data: ''
        },
        tableG2: {
          name: 'tableG2',
          title: 'TABLE G-2. GROUNDWATER GROSS CONTAMINATION ACTION LEVELS',
          notes: 'groundwater IS NOT a current or potential source of drinking water',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE G-2. GROUNDWATER GROSS CONTAMINATION ACTION LEVELS'
          },
          data: ''
        },
        tableG3: {
          name: 'tableG3',
          title: 'TABLE G-3. SURFACE WATER GROSS CONTAMINATION ACTION LEVELS',
          notes: 'surface water IS a current or potential source of drinking water',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE G-3. SURFACE WATER GROSS CONTAMINATION ACTION LEVELS'
          },
          data: ''
        },
        tableG4: {
          name: 'tableG4',
          title: 'TABLE G-4. SURFACE WATER GROSS CONTAMINATION ACTION LEVELS',
          notes: 'surface water IS NOT a current or potential source of drinking water',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE G-4. SURFACE WATER GROSS CONTAMINATION ACTION LEVELS'
          },
          data: ''
        },
        tableH: {
          name: 'tableH',
          title: 'TABLE H. PHYSIO-CHEMICAL AND TOXICITY CONSTANTS USED IN MODELS',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE H. PHYSIO-CHEMICAL AND TOXICITY CONSTANTS USED IN MODELS.'
          },
          data: ''
        },
        tableI1: {
          name: 'tableI1',
          title: 'TABLE I-1. DIRECT-EXPOSURE ACTION LEVELS 1UNRESTRICTED LAND USE SCENARIO',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE I-1. DIRECT-EXPOSURE ACTION LEVELS'
          },
          data: ''
        },
        tableI2: {
          name: 'tableI2',
          title: 'TABLE I-2. DIRECT-EXPOSURE ACTION LEVELS COMMERCIAL/INDUSTRIAL  LAND USE SCENARIO',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE I-2. DIRECT-EXPOSURE ACTION LEVELS'
          },
          data: ''
        },
        tableI3: {
          name: 'tableI3',
          title: 'TABLE I-3. DIRECT-EXPOSURE ACTION LEVELS CONSTRUCTION/TRENCH WORKER EXPOSURE SCENARIO',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE I-3. DIRECT-EXPOSURE ACTION LEVELS'
          },
          data: ''
        },
        tableJ: {
          name: 'tableJ',
          title: 'TABLE J. TARGET ORGANS AND CHRONIC HEALTH EFFECTS',
          notes: 'For general reference only.  May not be adequately comprehensive for some chemicals. Some noted effects may be insignificant.  Refer to original documents for additional information.',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE J. TARGET ORGANS AND CHRONIC HEALTH EFFECTS'
          },
          data: ''
        },
        tableK: {
          name: 'tableK',
          title: 'TABLE K. NATURAL BACKGROUND CONCENTRATIONS OF METALS IN SOIL',
          notes: '',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE K. 1NATURAL BACKGROUND CONCENTRATIONS OF METALS IN SOIL'
          },
          data: ''
        },
        tableL: {
          name: 'tableL',
          title: 'TABLE L. SOIL ECOTOXICITY ACTION LEVELS',
          notes: 'Discontinued as of Fall 2011 due to low confidence in use of published action levels in Hawai\'i.  See text Section 3.5.',
          check: {
            row: 0,
            col: 0,
            value: 'TABLE L. SOIL ECOTOXICITY ACTION LEVELS'
          },
          data: ''
        }
      }
    };
  },

  methods: {
    updateFile: function (event, file) {
      var dataFile = event.target.files[0];
      if (dataFile) {
        var reader = new FileReader();
        reader.addEventListener('load', () => {
          this.$set(file, 'data', reader.result);
        }, false);
        reader.readAsDataURL(dataFile);
      } else {
        this.$set(file, 'data', '');
      }
    },

    isValid: function (file) {
      if (file.data === '') {
        return 'No File';
      }

      var text = decodeBase64(file.data.replace('data:text/csv;base64,', ''));
      var data = csvToArray(text);

      var checkValue = function (text, value) {
        if (_.startsWith(text, value)) {
          return 'Okay';
        } else {
          return 'Wrong File';
        }
      };

      return checkValue(data[file.check.row][file.check.col], file.check.value);
    },

    isAllValid: function () {
      var isValid = true;
      _.each(this.files, (file) => {
        if (!this.isValid(file)) {
          isValid = false;
        }
      });

      return isValid;
    },

    sendToServer: function () {
      var data = _.mapValues(this.files, (f) => {
        return f.data;
      });
      this.working = true;

      fetch(this.$config.API + '/update/', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(data)
      }).then((res) => {
        return res.text();
      }).then((res) => {
        if (res === 'OK') {
          this.working = false;
          window.alert('Import Finished');
        } else {
          this.working = false;
          window.alert('Error: ' + res);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

</style>
