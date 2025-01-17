import { getRoot, fireEvent, compileAndExecute } from '../helpers/index'

describe('generate style', () => {
  it('should be now generated', () => {
    compileAndExecute(`
      <div>
        <text style="font-size: 100">Hello World</text>
      </div>
    `).then(instance => {
      expect(getRoot(instance)).toEqual({
        type: 'div',
        children: [{
          type: 'text',
          style: { fontSize: '100' },
          attr: { value: 'Hello World' }
        }]
      })
    })
  })

  it('should be generated by array binding', (done) => {
    compileAndExecute(`
      <div>
        <text :style="[x, y]" @click="foo">Hello {{z}}</text>
      </div>
    `, `
      data: {
        x: { fontSize: 100, color: '#00ff00' },
        y: { color: '#ff0000', fontWeight: 'bold' },
        z: 'World'
      },
      methods: {
        foo: function () {
          this.x.fontSize = 200
          this.x.color = '#0000ff'
          Vue.delete(this.y, 'fontWeight')
          this.z = 'Weex'
        }
      }
    `).then(instance => {
      expect(getRoot(instance)).toEqual({
        type: 'div',
        children: [
          {
            type: 'text',
            event: ['click'],
            style: { fontSize: 100, color: '#ff0000', fontWeight: 'bold' },
            attr: { value: 'Hello World' }
          }
        ]
      })
      fireEvent(instance, instance.document.body.children[0].ref, 'click')
      return instance
    }).then(instance => {
      expect(getRoot(instance)).toEqual({
        type: 'div',
        children: [
          {
            type: 'text',
            event: ['click'],
            style: { fontSize: 200, color: '#ff0000', fontWeight: '' },
            attr: { value: 'Hello Weex' }
          }
        ]
      })
      done()
    })
  })

  it('should be generated by map binding', (done) => {
    compileAndExecute(`
      <div>
        <text :style="{ fontSize: x, color: '#00ff00' }" @click="foo">Hello</text>
        <text :style="y">{{z}}</text>
      </div>
    `, `
      data: {
        x: 100,
        y: { color: '#ff0000', fontWeight: 'bold' },
        z: 'World'
      },
      methods: {
        foo: function () {
          this.x = 200
          this.y.color = '#0000ff'
          Vue.delete(this.y, 'fontWeight')
          this.z = 'Weex'
        }
      }
    `).then(instance => {
      expect(getRoot(instance)).toEqual({
        type: 'div',
        children: [
          {
            type: 'text',
            event: ['click'],
            style: { fontSize: 100, color: '#00ff00' },
            attr: { value: 'Hello' }
          },
          {
            type: 'text',
            style: { color: '#ff0000', fontWeight: 'bold' },
            attr: { value: 'World' }
          }
        ]
      })
      fireEvent(instance, instance.document.body.children[0].ref, 'click')
      return instance
    }).then(instance => {
      expect(getRoot(instance)).toEqual({
        type: 'div',
        children: [
          {
            type: 'text',
            event: ['click'],
            style: { fontSize: 200, color: '#00ff00' },
            attr: { value: 'Hello' }
          },
          {
            type: 'text',
            style: { color: '#0000ff', fontWeight: '' },
            attr: { value: 'Weex' }
          }
        ]
      })
      done()
    })
  })
})
