import React, {Component} from 'react';

import 'components/index.scss';
import {Status, Spacing} from 'components/shared';

import Card from 'components/Card';
import Stack from 'components/Stack';
import ButtonGroup from 'components/ButtonGroup';
import Button from 'components/Button';
import Badge from 'components/Badge';
import Banner from 'components/Banner';
import Layout from 'components/Layout';
import Field from 'components/Field';
import FormLayout from 'components/FormLayout';
import Frame from 'components/Frame';
import Select from 'components/Select';
import Popover from 'components/Popover';
import Tablist from 'components/Tablist';
import Checkbox from 'components/Checkbox';
import ChoiceList from 'components/ChoiceList';

const Foo = {};
export {Foo};

export default class App extends Component {
  state = {
    fieldValue: '',
    checked: false,
    selected: [],
  };

  renderPopoverCard(cardProperties) {
    return (
      <Card title="Popover" {...cardProperties}>
        <Stack distribution="equalSpacing">
          <Popover activator={<Button>Hello</Button>}>
            <span>lots and lots and lots and lots and lots and lots of content</span>
          </Popover>

          <Popover activator={<Button>Goodbye</Button>}>
            <span>Not much content</span>
          </Popover>
        </Stack>
      </Card>
    );
  }

  renderFormCard() {
    return (
      <Card
        title="Fields"
        tablist={<Tablist tabs={['Open', 'Unfulfilled', 'Fulfilled']} />}
      >
        <Card.Section>
          <FormLayout>
            <FormLayout.Group>
              <ChoiceList
                selected={this.state.selected}
                onChange={(selected) => this.setState({selected})}
                options={[
                  'Radio one',
                  'Radio two',
                  {label: 'Radio three', disabled: true},
                ]}
              />

              <ChoiceList
                allowMultiple
                selected={[]}
                options={[
                  'Multichoice one',
                  'Multichoice two',
                  'Multichoice three',
                ]}
              />
            </FormLayout.Group>

            <Checkbox
              label="Checkbox"
              checked={this.state.checked}
              onClick={() => this.setState({checked: !this.state.checked})}
            />

            <Checkbox label="Disabled checkbox" disabled checked />

            <Checkbox label="Radio button with a really long label that might stretch multiple lines" />

            <FormLayout.Group>
              <Field
                label="One"
                placeholder="0.00"
                leftAddon="$"
                rightAddon="USD"
                type="number"
                value={this.state.fieldValue}
                helpText="Help text"
                onChange={(event) => this.setState({fieldValue: event.target.value})}
              />

              <Field
                label="Two"
                labelNote="(optional)"
                placeholder="placeholder"
                value="Foo"
                readonly
              />

              <Field disabled label="Three" placeholder="placeholder" />
              <Field hasError label="Four" placeholder="placeholder" />

              <Field
                label="Five"
                placeholder="Five"
                connectedRight={<Button>Submit</Button>}
              />

              <Select label="Six" options={['foo', 'bar', 'baz']} />

              <Field
                label="Seven"
                placeholder="Seven"
                connectedLeft={<Select label="Eight" options={['foo', 'bar', 'baz']} />}
              />
            </FormLayout.Group>
          </FormLayout>
        </Card.Section>

        <Card.Section title="Condensed">
          <FormLayout condensed>
            <FormLayout.Group>
              <Field
                label="One"
                labelAction={<Button link>What?</Button>}
                placeholder="placeholder"
              />

              <Field label="Two" placeholder="placeholder" />
              <Field label="Three" placeholder="placeholder" />
              <Field label="Four" placeholder="placeholder" />
            </FormLayout.Group>
          </FormLayout>
        </Card.Section>
      </Card>
    );
  }

  renderBannerCard() {
    return (
      <Card title="Banners">
        <Stack vertical>
          <Banner title="A banner">
            <p>This order was marked as archived on September 26, 2015 21:33 EST.</p>
          </Banner>

          <Banner title="A success banner" status={Status.success}>
            <p>This order was marked as archived on September 26, 2015 21:33 EST.</p>
          </Banner>

          <Banner title="An info banner" status={Status.info}>
            <p>This order was marked as archived on September 26, 2015 21:33 EST.</p>
          </Banner>

          <Banner title="A warning banner" status={Status.warning}>
            <p>This order was marked as archived on September 26, 2015 21:33 EST.</p>
          </Banner>

          <Banner title="A critical banner" status={Status.critical}>
            <p>This order was marked as archived on September 26, 2015 21:33 EST.</p>
          </Banner>
        </Stack>
      </Card>
    );
  }

  renderButtonCard(cardProperties) {
    return (
      <Card title="Buttons" {...cardProperties}>
        <ButtonGroup>
          <Button>Default button</Button>
          <Button primary>Primary button</Button>
          <Button destructive>Destructive button</Button>
          <Button disabled>Disabled button</Button>
        </ButtonGroup>
      </Card>
    );
  }

  renderBadgeCard(cardProperties) {
    return (
      <Card title="Badges" {...cardProperties}>
        <Stack spacing={Spacing.tight}>
          <Badge>Regular</Badge>
          <Badge status={Status.subdued}>Subdued</Badge>
          <Badge status={Status.info}>Info</Badge>
          <Badge status={Status.success}>Success</Badge>
          <Badge status={Status.attention}>Attention</Badge>
          <Badge status={Status.warning}>Warning</Badge>
          <Badge status={Status.critical}>Error</Badge>
        </Stack>
      </Card>
    );
  }

  render() {
    return (
      <Frame>
        <Layout>
          <Layout.AnnotatedSection
            title="Annotated section"
            description="This is a description for an annotated section!"
          >
            <Card title="Card">
              Here is some content!
            </Card>
          </Layout.AnnotatedSection>

          <Layout.Section>
            {this.renderFormCard()}
            {this.renderBannerCard()}
          </Layout.Section>

          <Layout.Section secondary>
            {this.renderPopoverCard({secondary: true})}
            {this.renderButtonCard({secondary: true})}
            {this.renderBadgeCard({secondary: true})}
          </Layout.Section>
        </Layout>
      </Frame>
    );
  }
}