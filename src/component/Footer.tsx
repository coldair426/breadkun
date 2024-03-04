import React from 'react';
import styles from '../style/Footer.module.scss';
import classNames from 'classnames/bind';

const fs = classNames.bind(styles);

function Footer() {
    return <footer className={fs('footer')}></footer>;
}

export default Footer;
