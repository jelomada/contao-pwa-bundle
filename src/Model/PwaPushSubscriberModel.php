<?php
/**
 * Contao Open Source CMS
 *
 * Copyright (c) 2018 Heimrich & Hannot GmbH
 *
 * @author  Thomas Körner <t.koerner@heimrich-hannot.de>
 * @license http://www.gnu.org/licences/lgpl-3.0.html LGPL
 */


namespace HeimrichHannot\ContaoPwaBundle\Model;

use Contao\Model;

/**
 * Class PwaSubscriberModel
 * @package HeimrichHannot\ContaoPwaBundle\Model
 *
 * @property int $id
 * @property int $pid
 * @property int $tstamp
 * @property int $dateAdded
 * @property int $lastSuccessfulSend
 * @property string $endpoint
 * @property string $publicKey
 * @property string $authToken
 */
class PwaPushSubscriberModel extends Model
{
	protected static $strTable = 'tl_pwa_pushsubscriber';
}