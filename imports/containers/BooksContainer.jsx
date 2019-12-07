import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AccordionContent,
  Block,
  Page,
  Navbar,
  Toolbar,
  Link,
  BlockTitle,
  List,
  Range,
  ListItem,
  ListInput,
} from 'framework7-react';

import { Books } from '../api/collections';

class Info extends Component {
  render() {
    console.log('ccicici');
    const books = this.props.books.map(book => this.makeLink(book));

    return (
      <Page>
        {/* Top Navbar */}
        <Navbar title="Pomegra"></Navbar>
        {/* Toolbar */}

        <BlockTitle>Simple Links List</BlockTitle>
        <List accordionList>
          <ListItem accordionItem title="Link 1" link="#">
            <AccordionContent>
              <Block>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aenean elementum id neque nec commodo. Sed vel justo at turpis
                  laoreet pellentesque quis sed lorem. Integer semper arcu nibh,
                  non mollis arcu tempor vel. Sed pharetra tortor vitae est
                  rhoncus, vel congue dui sollicitudin. Donec eu arcu dignissim
                  felis viverra blandit suscipit eget ipsum.
                </p>
              </Block>
            </AccordionContent>
          </ListItem>
          <ListItem title="Link 2" link="#"></ListItem>
          <ListItem title="Link 3" link="#"></ListItem>
        </List>

        <List>
          <ListItem title="Fruit" smartSelect>
            <select name="fruits" defaultValue="apple">
              <option value="apple">Apple</option>
              <option value="pineapple">Pineapple</option>
              <option value="pear">Pear</option>
              <option value="orange">Orange</option>
              <option value="melon">Melon</option>
              <option value="peach">Peach</option>
              <option value="banana">Banana</option>
            </select>
          </ListItem>

          <ListItem
            title="Car"
            smartSelect
            smartSelectParams={{
              openIn: 'popup',
              searchbar: true,
              searchbarPlaceholder: 'Search car',
            }}
          >
            <select
              name="car"
              multiple
              defaultValue={['honda', 'audi', 'ford']}
            >
              <optgroup label="Japanese">
                <option value="honda">Honda</option>
                <option value="lexus">Lexus</option>
                <option value="mazda">Mazda</option>
                <option value="nissan">Nissan</option>
                <option value="toyota">Toyota</option>
              </optgroup>
              <optgroup label="German">
                <option value="audi">Audi</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes</option>
                <option value="vw">Volkswagen</option>
                <option value="volvo">Volvo</option>
              </optgroup>
              <optgroup label="American">
                <option value="cadillac">Cadillac</option>
                <option value="chrysler">Chrysler</option>
                <option value="dodge">Dodge</option>
                <option value="ford">Ford</option>
              </optgroup>
            </select>
          </ListItem>

          <ListItem
            title="Mac or Windows"
            smartSelect
            smartSelectParams={{ openIn: 'sheet' }}
          >
            <select name="mac-windows" defaultValue="mac">
              <option value="mac">Mac</option>
              <option value="windows">Windows</option>
            </select>
          </ListItem>

          <ListItem
            title="Super Hero"
            smartSelect
            smartSelectParams={{ openIn: 'popover' }}
          >
            <select name="superhero" multiple defaultValue={['Batman']}>
              <option value="Batman">Batman</option>
              <option value="Superman">Superman</option>
              <option value="Hulk">Hulk</option>
              <option value="Spiderman">Spiderman</option>
              <option value="Ironman">Ironman</option>
              <option value="Thor">Thor</option>
              <option value="Wonder Woman">Wonder Woman</option>
            </select>
          </ListItem>
        </List>

        <BlockTitle>Songs</BlockTitle>
        <List mediaList accordionList>
          <ListItem
            link="#"
            title="Yellow Submarine"
            after="$15"
            subtitle="Beatles"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
          >
            <img
              slot="media"
              src="https://cdn.framework7.io/placeholder/people-160x160-1.jpg"
              width="80"
            />
          </ListItem>
          <ListItem
            link="#"
            title="Don't Stop Me Now"
            after="$22"
            subtitle="Queen"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
          >
            <img
              slot="media"
              src="https://cdn.framework7.io/placeholder/people-160x160-2.jpg"
              width="80"
            />
          </ListItem>
          <ListItem
            link="#"
            title="Billie Jean"
            after="$16"
            subtitle="Michael Jackson"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
          >
            <img
              slot="media"
              src="https://cdn.framework7.io/placeholder/people-160x160-3.jpg"
              width="80"
            />
          </ListItem>
        </List>

        <List noHairlinesMd>
          <ListInput
            label="Name"
            type="text"
            placeholder="Your name"
            clearButton
          ></ListInput>

          <ListInput
            label="Password"
            type="password"
            placeholder="Your password"
            clearButton
          ></ListInput>

          <ListInput
            label="E-mail"
            type="email"
            placeholder="Your e-mail"
            clearButton
          ></ListInput>

          <ListInput
            label="URL"
            type="url"
            placeholder="URL"
            clearButton
          ></ListInput>

          <ListInput
            label="Phone"
            type="tel"
            placeholder="Your phone number"
            clearButton
          ></ListInput>

          <ListInput
            label="Gender"
            type="select"
            defaultValue="Male"
            placeholder="Please choose..."
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </ListInput>

          <ListInput
            label="Birthday"
            type="date"
            defaultValue="2014-04-30"
            placeholder="Please choose..."
          ></ListInput>

          <ListInput
            label="Date time"
            type="datetime-local"
            placeholder="Please choose..."
          ></ListInput>

          <ListInput label="Range" input={false}>
            <Range slot="input" value={50} min={0} max={100} step={1} />
          </ListInput>

          <ListInput
            label="Textarea"
            type="textarea"
            placeholder="Bio"
          ></ListInput>

          <ListInput
            label="Resizable"
            type="textarea"
            resizable
            placeholder="Bio"
          ></ListInput>
        </List>

        <Toolbar bottom>
          <Link>Link 1</Link>
          <Link>Link 2</Link>
        </Toolbar>
        {/* Page Content */}
      </Page>
    );
  }

  makeLink(book) {
    return (
      <li key={book._id}>
        <a href={book.url} target="_blank">
          {book.title}
        </a>
      </li>
    );
  }
}

export default BooksContainer = withTracker(props => {
  const books = Books.find().fetch();
  return {
    books,
  };
})(Info);
