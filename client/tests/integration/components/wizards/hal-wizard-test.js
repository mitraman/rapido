import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wizards/hal-wizard', 'Integration | Component | wizards/hal wizard', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{wizards/hal-wizard}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#wizards/hal-wizard}}
      template block text
    {{/wizards/hal-wizard}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
