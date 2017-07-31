<?php

function checkIfUserIsLoggedIn()
{
    phpCAS::client(SAML_VERSION_1_1, CAS_DOMAIN, 443, '/cas', false);
    phpCAS::setCasServerCACert(CAS_CERT_PATH);
    phpCAS::handleLogoutRequests(true, CAS_HOSTS);
    phpCAS::forceAuthentication();

    $_SESSION['username'] = phpCAS::getUser();

    if ($_SESSION['username']) {
        if ($_SESSION['loggedInLocally']) {
            setSessionVariables();
        }
    } else {
        //Independent student, redirect them to the ape registration page
    }

    $_SESSION['loggedInLocally'] = true;
}

function setSessionVariables()
{
    global $db;
    $samlAttribs = phpCAS::getAttributes();

    $_SESSION['firstName'] = $samlAttribs['FirstName'];
    $_SESSION['lastName'] = $samlAttribs['LastName'];
    $_SESSION['userType'] = $samlAttribs['UserType'];
    $_SESSION['ewuid'] = $samlAttribs['Ewuid'];

    if ($_SESSION['ewuid'] && $_SESSION['username']) {
        $id = $_SESSION['ewuid'];
        $sql = executeQuery("SELECT type FROM account WHERE EWU_ID = $id");
        $result = getQueryResult($sql);

        $_SESSION['userGroup'] = $result;
    }

}

function logout()
{
    phpCAS::logout();
}

?>