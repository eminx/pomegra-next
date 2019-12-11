import React, { Fragment, PureComponent } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Block,
  Link,
  List,
  ListItem
} from 'framework7-react'

const detailListItemStyle = {
  justifyContent: 'flex-end',
  height: 18,
  fontSize: 12
}

class BookCard extends PureComponent {
  state = {}

  render () {
    const { volumeInfo, footerComponents } = this.props

    const authors = (
      <div
        style={{
          padddingTop: 12,
          fontWeight: 'lighter',
          wordBreak: 'break-all',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {volumeInfo.authors &&
          volumeInfo.authors.map((author, index) => (
            <span key={author}>
              {author + (volumeInfo.authors.length !== index + 1 ? ', ' : '')}
            </span>
          ))}
      </div>
    )

    return (
      <Card className='demo-card-header-pic' title={volumeInfo.title}>
        <CardHeader
          className='no-border'
          valign='bottom'
          style={
            volumeInfo.imageLinks && {
              backgroundImage: `url(${volumeInfo.imageLinks.thumbnail})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: '#010101',
              height: 120,
              backgroundSize: 'contain'
            }
          }
        />
        <CardContent>
          <Block>
            <List
              simpleList
              style={{ paddingTop: 12, paddingBottom: 12 }}
              noHairlinesBetween
            >
              <ListItem style={{ paddingLeft: 0 }}>{authors}</ListItem>
              <ListItem style={detailListItemStyle}>
                {' '}
                {volumeInfo.printType}, {volumeInfo.language.toUpperCase()},{' '}
                {volumeInfo.publishedDate}
              </ListItem>
              <ListItem style={detailListItemStyle}>
                {volumeInfo.publisher}
              </ListItem>
              <ListItem style={detailListItemStyle}>
                {volumeInfo.categories && volumeInfo.categories[0]}
              </ListItem>
            </List>
          </Block>
          <p>{volumeInfo.description}</p>
        </CardContent>
        <CardFooter style={{ display: 'flex', justifyContent: 'center' }}>
          {footerComponents}
        </CardFooter>
      </Card>
    )
  }
}

export default BookCard
