import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import TAG from '../common/MetaTag.js';
import CONST from '../common/Const.js';

  var Style = {
    display:"none",
    visibility:"hidden"
  };


class Layout extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }

    render() {
      // console.log(this.props)
        const { custom } = this.props;
        return (
            <html>
                <head>
                    <title>{TAG.title[this.props.location.pathname] ? TAG.title[this.props.location.pathname] : 'Legably'}</title>
                    <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
                    <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
                    <meta name="viewport" content="width=device-width"/>
                    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
                    <meta name="Description" content={TAG.desc[this.props.location.pathname]} />

                    <link rel="stylesheet" href="/css/bootstrap.min.css" />
                    <link href="//fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                    <link rel="stylesheet" href="/css/font-awesome.min.css"/>
                    <link rel="stylesheet" href="/css/propeller.min.css"/>

                    <link rel="stylesheet" href="/css/font-style.css"/>
                    <link rel="stylesheet" href="/css/custom-fonts.css"/>
                    <link rel="stylesheet" href="/css/basic-style.css"/>

                    <link rel="stylesheet" href="/css/sumoselect.min.css"/>

                    <link rel="stylesheet" href="/css/reactDateTime.css"/>
                    <link rel="stylesheet" href="/css/basic-info-page.css"/>
                    <link rel="stylesheet" href="/css/react-widgets.css"/>
                    <link rel="stylesheet" href="/css/style.css" />
                    <link rel="stylesheet" href="/css/steps-widget.css"/>
                    <link rel="stylesheet" href="/css/sign-up-job1.css"/>
                    <link rel="stylesheet" href="/css/loader.css"/>

                    <link rel="stylesheet" href="/css/bootstrap-multiselect.css" type="text/css" />
                    <link rel="stylesheet" href="/css/react-select.min.css" />
                    <link rel="stylesheet" href="/css/avatarCropper.css"/>

                    <script dangerouslySetInnerHTML={{__html: `
                      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','GTM-PCMQF69');`
                    }} />


                     <link rel="stylesheet" href="/css/job-posting.css"/>
                    <link rel="stylesheet" href="/css/job-preview.css"/>

                </head>
                <body>
                <noscript dangerouslySetInnerHTML={{__html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PCMQF69"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
                    }} />
                       {this.props.children}
                  <script type="text/javascript" src="/js/jquery.min.js" />
                  <script type="text/javascript" src="/js/bootstrap.min.js" />
                  <script type="text/javascript" src="/js/custom.js" />

                  <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer/>
                  <script type="text/javascript" src="//propeller.in/components/select2/js/select2.full.js"></script>

                  <script dangerouslySetInnerHTML={{
                      __html: 'window.PROPS=' + JSON.stringify(custom)
                  }} />
                 <script src="//propeller.in/components/range-slider/js/wNumb.js"></script>
                 <script src="//propeller.in/components/range-slider/js/nouislider.js"></script>
                 <script src="//cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.10/jquery.mask.js"></script>

                 <script src='/bundle.js' />
                </body>
            </html>
        );
    }
}

const wrapper = connect(
    (state) => {
        return { custom: state };
    }
);

export default wrapper(Layout);
