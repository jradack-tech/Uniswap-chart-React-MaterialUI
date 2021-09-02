import React from 'react';
import jQuery from 'jquery'
import { Link } from 'react-router-dom';

class Navigation extends React.Component {
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    var _self = this;
        document.addEventListener("DOMContentLoaded", function() {
          const main = document.querySelector("body");
          const toggleSwitch = document.querySelector(".switch");

          toggleSwitch.addEventListener("click", () => {
            main.classList.toggle("dark-theme");
            // _self.props.setTheme(main.classList.value);
          });
        });

       jQuery(
          (function() {
            "use strict";
            document.addEventListener("touchstart", function() {}, false);
            jQuery(function() {
              jQuery("body").wrapInner('<div class="horizontalMenucontainer" />');
              jQuery('<div class="horizontal-overlapbg"></div>').prependTo(
                ".horizontalMenu"
              );
              jQuery(".horizontal-navtoggle").click(function() {
                jQuery("body").toggleClass("active");
              });
              jQuery(".horizontal-overlapbg").click(function() {
                jQuery("body").removeClass("active");
              });
              jQuery(".horizontalMenu > .horizontalMenu-list > li")
                .has(".sub-menu")
                .prepend(
                  '<span class="horizontalMenu-click"><i class="horizontalMenu-arrow fa fa-angle-down"></i></span>'
                );
              jQuery(".horizontalMenu > .horizontalMenu-list > li")
                .has(".horizontal-megamenu")
                .prepend(
                  '<span class="horizontalMenu-click"><i class="horizontalMenu-arrow fa fa-angle-down"></i></span>'
                );
              jQuery(".horizontalMenu-click").click(function() {
                jQuery(this)
                  .toggleClass("horizontal-activearrow")
                  .parent()
                  .siblings()
                  .children()
                  .removeClass("horizontal-activearrow");
                jQuery(
                  ".horizontalMenu > .horizontalMenu-list > li > .sub-menu, .horizontal-megamenu"
                )
                  .not(
                    jQuery(this).siblings(
                      ".horizontalMenu > .horizontalMenu-list > li > .sub-menu, .horizontal-megamenu"
                    )
                  )
                  .slideUp("slow");
                jQuery(this)
                  .siblings(".sub-menu")
                  .slideToggle("slow");
                jQuery(this)
                  .siblings(".horizontal-megamenu")
                  .slideToggle("slow");
              });
              jQuery(".horizontalMenu > .horizontalMenu-list > li > ul > li")
                .has(".sub-menu")
                .prepend(
                  '<span class="horizontalMenu-click02"><i class="horizontalMenu-arrow fa fa-angle-down"></i></span>'
                );
              jQuery(
                ".horizontalMenu > .horizontalMenu-list > li > ul > li > ul > li"
              )
                .has(".sub-menu")
                .prepend(
                  '<span class="horizontalMenu-click02"><i class="horizontalMenu-arrow fa fa-angle-down"></i></span>'
                );
              jQuery(".horizontalMenu-click02").click(function() {
                jQuery(this)
                  .children(".horizontalMenu-arrow")
                  .toggleClass("horizontalMenu-rotate");
                jQuery(this)
                  .siblings("li > .sub-menu")
                  .slideToggle("slow");
              });
              jQuery(window).on("resize", function() {
                if (jQuery(window).outerWidth() < 992) {
                  jQuery(".horizontalMenu").css(
                    "height",
                    jQuery(this).height() + "px"
                  );
                  jQuery(".horizontalMenucontainer").css(
                    "min-width",
                    jQuery(this).width() + "px"
                  );
                } else {
                  jQuery(".horizontalMenu").removeAttr("style");
                  jQuery(".horizontalMenucontainer").removeAttr("style");
                  jQuery("body").removeClass("active");
                  jQuery(
                    ".horizontalMenu > .horizontalMenu-list > li > .horizontal-megamenu, .horizontalMenu > .horizontalMenu-list > li > ul.sub-menu, .horizontalMenu > .horizontalMenu-list > li > ul.sub-menu > li > ul.sub-menu, .horizontalMenu > .horizontalMenu-list > li > ul.sub-menu > li > ul.sub-menu > li > ul.sub-menu"
                  ).removeAttr("style");
                  jQuery(".horizontalMenu-click").removeClass(
                    "horizontal-activearrow"
                  );
                  jQuery(".horizontalMenu-click02 > i").removeClass(
                    "horizontalMenu-rotate"
                  );
                }
              });
              jQuery(window).trigger("resize");
            });
          })()
        );
  }

  render() {
    return (
          <div>
            <div className="sticky">
              <div className="horizontal-main hor-menu clearfix">
                <div className="horizontal-mainwrapper container clearfix">
                  <div className="nav-wrp">
                    <div className="logo-wrp">
                      <Link to="/"
                        ><img
                          src="/assets/images/tz_logo.png"
                          className="header-brand-img desktop-logo"
                          alt="logo"
                      /></Link>
                      <Link to="/"
                        ><img
                          src="/assets/images/dlogo.png"
                          className="header-brand-img dark-logo"
                          alt="logo"
                      /></Link>
                    </div>
                    <div>
                      <nav className="horizontalMenu clearfix">
                        <ul className="horizontalMenu-list">
                          <li aria-haspopup="true">
                            <Link to="/uniswapexplorer/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                              >Uniswap explorer</Link>
                          </li>
                          <li aria-haspopup="true">
                            <Link to="#" className="sub-icon">Sushiswap explorer</Link>
                          </li>
                          <li aria-haspopup="true">
                            <Link to="#" className="sub-icon">Bsc explorer</Link>
                          </li>
                          <li aria-haspopup="true">
                            <Link to="/bigswapexplorer"
                              >Big Swap Explorer</Link>
                          </li>
                          <li aria-haspopup="true">
                            <Link to="#" className="sub-icon">MultiSwap</Link>
                          </li>
                          <li aria-haspopup="true">
                            <Link to="editprofile">User Account</Link>
                          </li>
                          <li aria-haspopup="true">
                            <div className="switch">
                              <span className="btn-toggle"></span>
                            </div>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mobile-header hor-mobile-header">
              <div className="container">
                <div className="d-flex">
                  <Link className="header-brand" to="/">
                    <img
                      src="/assets/images/tz_logo.png"
                      className="header-brand-img desktop-logo mobile-light"
                      alt="logo"
                    />
                    <img
                      src="/assets/images/dlogo.png"
                      className="header-brand-img desktop-logo mobile-dark"
                      alt="logo"
                    />
                  </Link>
                  <div className="d-flex order-lg-2 ml-auto header-right-icons">
                    <a className="animated-arrow hor-toggle horizontal-navtoggle"><span></span></a>

                  </div>
                </div>
              </div>
            </div>
            <div
              className="mb-1 navbar navbar-expand-lg  responsive-navbar navbar-dark d-md-none bg-white"
            >
              <div className="collapse navbar-collapse" id="navbarSupportedContent-4">
                <div className="d-flex order-lg-2 ml-auto">
                  <div className="dropdown d-sm-flex">
                    <Link to="#" className="nav-link icon" data-toggle="dropdown">
                      <i className="fe fe-search"></i>
                    </Link>
                    <div className="dropdown-menu header-search dropdown-menu-left">
                      <div className="input-group w-100 p-2">
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Search...."
                        />
                        <div className="input-group-append ">
                          <button type="button" className="btn btn-primary ">
                            <i className="fa fa-search" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    )
  }
}


export default Navigation;