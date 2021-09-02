import { testBehavior } from './behavior'

Component({
  options: {
    styleIsolation: 'shared'
  },
  behaviors: [testBehavior],
  data: {
    someData: '...'
  },
})
